#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import {FluxEcoNodeHttpServer} from "../../flux-eco-node-http-server/app/FluxEcoNodeHttpServer.mjs";
import Api from "./http-request-handler/Api.mjs";

const readFile = (filePath) => {
    const absoluteFilePath = path.resolve(filePath);
    const absoluteDirName = path.dirname(absoluteFilePath);

    const httpServerConfigBuffer = fs.readFileSync(filePath, 'utf-8');
    const object = JSON.parse(httpServerConfigBuffer.toString());
    return resolveRefs(object, absoluteDirName);
}

const resolveRefs = (object, absoluteDirName) => {
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
                    let filePath = "";
                    let propertyParts = [];
                    if (ref.endsWith("#")) {
                        const refParts = ref.split("#");
                        filePath = refParts[0];
                        propertyParts = refParts[1];
                    } else {
                        filePath = ref;
                    }
                    const absoluteFilePath = path.resolve(path.join(absoluteDirName, filePath));
                    const referencedJson = readFile(absoluteFilePath)
                    let referencedValue = referencedJson;
                    propertyParts.forEach(propertyName => {
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
            object[key] = resolveRefs(property, absoluteDirName);
        }
    }
    return object;
}

async function app() {
    /**
     * @type {MediEcoBookStackFrontendConfig} config
     */
    const config = readFile("./config.json");
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


