import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyBcrypt from "fastify-bcrypt";
import fastifyPlugin from "fastify-plugin";

const bcryptPlugin = async (fastify: FastifyInstance, _: FastifyPluginOptions) => {
    fastify.register(fastifyBcrypt, {
        saltWorkFactor: 12
    })
}

export default fastifyPlugin(bcryptPlugin)