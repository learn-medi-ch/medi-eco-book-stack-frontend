#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import {FluxEcoNodeHttpServer} from "../../flux-eco-node-http-server/app/FluxEcoNodeHttpServer.mjs";
import Api from "./http-request-handler/Api.mjs";

const readFile = (filePath) => {
    const httpServerConfigBuffer = fs.readFileSync(filePath, 'utf-8');
    const object = JSON.parse(httpServerConfigBuffer.toString());
    return resolveRefs(object, "./");
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
    console.log(object);
    for (const [key, property] of Object.entries(object)) {
        if (property !== null && typeof property === 'object') {
            console.log(property);
            console.log(property.hasOwnProperty("$ref"))
            if (property.hasOwnProperty("$ref")) {
                console.log(property);
                if (property["$ref"].startsWith("#") === false) {
                    const ref = property["$ref"];
                    const refParts = ref.split("#");

                    const referencedJsonBuffer = fs.readFileSync(path.join(objectPath, refParts[0]));
                    const referencedJson = JSON.parse(referencedJsonBuffer.toString());

                    const propertyPath = refParts[1].split("/");

                    let referencedValue = referencedJson;
                    propertyPath.forEach(propertyName => {
                        referencedValue = referencedValue[propertyName];
                    });
                    if (referencedValue) {
                        object[key] = referencedValue;
                    } else {
                        object[key] = referencedJson;
                    }
                    continue;
                }
            }
            if (objectPath) {

                object[key] = resolveRefs(property, objectPath);
            }

        }

    }
    return object;
}

async function app() {
    /**
     * @type {MediEcoBookStackFrontendConfig} config
     */
    const config = resolveRefs(readFile("./config.json"));

    console.log(config);

    const server = await FluxEcoNodeHttpServer.new(
        {
            schemas: {
                actionsSchema: config.httpRequestHandlerConfig.schemas.actionsSchema,
                filePathsSchema: config.domHandlerConfig.schemas.filePathsSchema
            },
            settings: {
                host: config.httpServer.host,
                port: config.httpServer.port
            }
        },
        Api.new(config.httpRequestHandlerConfig)
    )
    // Start the server
    server.start();
}

app();


