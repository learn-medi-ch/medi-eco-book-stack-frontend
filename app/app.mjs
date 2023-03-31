#!/usr/bin/env node
import fs from "node:fs";
import {FluxEcoNodeHttpServer} from "../../flux-eco-node-http-server/app/server/FluxEcoNodeHttpServer.mjs";
import Api from "./backend/Api.mjs";

const readFile = (filePath) => {
    const httpServerConfigBuffer = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(httpServerConfigBuffer.toString());
}

async function app() {
    const apiConfig = readFile("./backend/configs/api-config.json");
    const httpServerConfig = readFile("./backend/configs/flux-eco-node-http-server-config.json");
    const server = await FluxEcoNodeHttpServer.new(
        httpServerConfig,
        Api.new(apiConfig)
    )
    // Start the server
    server.start();
}

app();