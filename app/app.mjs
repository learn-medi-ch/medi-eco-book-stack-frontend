#!/usr/bin/env node
import fs from "node:fs";
import {FluxEcoNodeHttpServer} from "./flux-eco-node-http-server/app/server/FluxEcoNodeHttpServer.mjs";
import MediEcoBookStackQueryActionsApi from "./api/MediEcoBookStackQueryActionsApi.mjs";

const readFile = (filePath) => {
    const httpServerConfigBuffer = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(httpServerConfigBuffer.toString());
}

async function app() {
    const settings = readFile("./configs/settings.json");
    const httpServerConfig = readFile("./configs/flux-eco-node-http-server-config.json");
    const server = await FluxEcoNodeHttpServer.new(
        httpServerConfig,
        MediEcoBookStackQueryActionsApi.new({
            settings: settings
        })
    )
    // Start the server
    server.start();
}

app();