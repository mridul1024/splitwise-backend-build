import { FastifyListenOptions } from "fastify";
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
    host: process.env['SERVER_HOST']
}
