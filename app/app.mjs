#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {FluxEcoNodeHttpServer} from "../../flux-eco-node-http-server/app/server/FluxEcoNodeHttpServer.mjs";
import Api from "./backend/Api.mjs";

const readFile = (filePath) => {
    const httpServerConfigBuffer = fs.readFileSync(filePath, 'utf-8');
    const object = JSON.parse(httpServerConfigBuffer.toString());
    return resolveRefs(object, "./configs");
}

const resolveRefs = (object, objectPath) => {
    if (object === null) {
        return object;
    }
    if (typeof object !== 'object') {
        return object;
    }

    /**
     * e.g
     * "actions": {
     *    "$ref": "../schemas/backend.json#actions"
     * }
     */

    for (const [key, property] of Object.entries(object)) {
        if (property !== null && typeof property === 'object') {
            if (property.hasOwnProperty("$ref")) {
                if (property["$ref"].startsWith("#") === false) {
                    const ref = property["$ref"];
                    const refParts = ref.split("#/");

                    const referencedJsonBuffer = fs.readFileSync(path.join(objectPath,refParts[0]));
                    const referencedJson = JSON.parse(referencedJsonBuffer.toString());

                    const propertyPath = refParts[1].split("/");
                    let referencedValue = referencedJson;
                    propertyPath.forEach(propertyName => {
                        referencedValue = referencedValue[propertyName];
                    });
                    object[key] = referencedValue;
                    continue;
                }
            }
            object[key] = resolveRefs(property, objectPath);
        }

    }
    return object;
}

async function app() {
    const backendConfig = readFile("./configs/backend-config.json");
    const httpServerConfig = readFile("./configs/http-server-config.json");
    const server = await FluxEcoNodeHttpServer.new(
        httpServerConfig,
        Api.new(backendConfig)
    )
    // Start the server
    server.start();
}

app();


