import fastify, { FastifyBaseLogger, FastifyHttpOptions, FastifyListenOptions, FastifyServerOptions } from "fastify";
import { Server } from "http";
import { Http2SecureServer } from "http2";
import dotEnv from 'dotenv';

dotEnv.config();

/**
 * Server configuration object 
 */
export const serverConfiguration = {
    logger: {
        level: 'info'
    },
}

export const fastifyListenerConfiguration: FastifyListenOptions = {
    port: Number(process.env['SERVER_PORT']),
}
