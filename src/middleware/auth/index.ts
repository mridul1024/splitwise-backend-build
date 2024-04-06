import { FastifyReply, FastifyRequest } from "fastify"

/**
 * @method authCheck
 * @description Authentication check intermidiary function 
 * @param request {FastifyRequest}
 * @param reply {FastifyReply}
 */
export const authCheck = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  }