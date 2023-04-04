#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import {FluxEcoNodeHttpServer} from "./flux-eco-node-http-server/FluxEcoNodeHttpServer.mjs";
import Api from "./http-request-handler/Api.mjs";

const readFile = (filePath) => {
    const absoluteFilePath = path.resolve(filePath);
    const absoluteDirName = path.dirname(absoluteFilePath);

    const httpServerConfigBuffer = fs.readFileSync(filePath, 'utf-8');
    const object = resolveEnvVariables(JSON.parse(httpServerConfigBuffer.toString()));
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

const resolveEnvVariables = (object) => {
    if (object === null) {
        return object;
    }
    if (typeof object !== 'object') {
        return object;
    }
    const resolved = Array.isArray(object) ? [] : {};
    for (const [key, value] of Object.entries(object)) {
        if (typeof value === 'string' && value.startsWith('$')) {
            const envVar = value.slice(1);
            const envVarName = envVar.replace(/[{}]/g, '');
            resolved[key] = process.env[envVarName];
        } else {
            resolved[key] = resolveEnvVariables(value);
        }
    }
    return resolved;
}

async function app() {
    /**
     * @type {MediEcoBookStackFrontendConfig} config
     */
    const config = readFile("./config.json");
    const settings = config.settings;
    const server = await FluxEcoNodeHttpServer.new(
        {
            schemas: {
                actionsSchema: settings.httpRequestHandlerConfig.schemas.actionsSchema,
                filePathsSchema: settings.domHandlerConfig.schemas.filePathsSchema
            },
            settings: {
                host: settings.httpServer.host,
                port: settings.httpServer.port
            }
        },
        Api.new(settings.httpRequestHandlerConfig)
    )
    // Start the server
    server.start();
}

app();


