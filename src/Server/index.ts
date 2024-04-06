import fastify, { FastifyInstance, FastifyPluginCallback } from "fastify";
import { fastifyListenerConfiguration as listenerConf, serverConfiguration as serverConf } from "./config";
import { pluginRegistryMapper } from "../Utils/pluginRegistryMapper";

/**
 * @class This is the ApplicationServer wrapper class which will handle different stuff related to the server
 * 
 */
export class ApplicationServer { 
    private server: FastifyInstance;

    constructor(){
        this.server = fastify(serverConf);
    }

    async getInstance() {
        return this.server;
    }

    async registerPlugins(pluginSet: FastifyPluginCallback[]) {
        pluginRegistryMapper(this.server, pluginSet);
    }

    async serve() {
        this.server.listen(listenerConf, (error, address) => {
            if(error) this.server.log.error(error, 'Server failed to start');
            this.server.log.info({}, 'Server is running...');
        })
    }
}