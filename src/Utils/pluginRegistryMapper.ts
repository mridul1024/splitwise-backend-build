import { FastifyInstance, FastifyPluginCallback } from "fastify";

/**
 * @method pluginRegistryMapper
 * @description Fastify plugin mapper helper function which will be used to register plugins.
 * @param fastify Instance of the fastify server
 * @param plugins Array of plugins which is required to be attached to the application instance
 */
export const pluginRegistryMapper = <T extends FastifyPluginCallback>(fastify: FastifyInstance, plugins: T[]) => {
    plugins.forEach((plugin) => {
        fastify.register(plugin);
    })    
}