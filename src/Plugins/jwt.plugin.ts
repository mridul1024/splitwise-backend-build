import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import {fastifyJwt} from "@fastify/jwt"
import dotenv from 'dotenv';
import fastifyPlugin from "fastify-plugin";

dotenv.config();
 
const JwtAuthenticationPlugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.register(fastifyJwt, {
        secret: `${process.env['JWT_SECRET']}`,
      })
}

export default fastifyPlugin(JwtAuthenticationPlugin);