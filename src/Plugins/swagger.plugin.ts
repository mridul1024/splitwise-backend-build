import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifySwagger from "@fastify/swagger"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fastifyPlugin from "fastify-plugin"

const swaggerPlugin = async (fastify: FastifyInstance, _: FastifyPluginOptions) => {
    fastify.register(fastifySwagger)
    fastify.register(fastifySwaggerUi, {
        routePrefix: 'api/docs',
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false
        },
        uiHooks: {
          onRequest: function (request, reply, next) { next() },
          preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return {
          ...swaggerObject,
          info: {
            title: "Splitwise API docs"
          },
        } },
        transformSpecificationClone: true
      })
}

export default fastifyPlugin(swaggerPlugin)