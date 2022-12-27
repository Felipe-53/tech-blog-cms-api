import fastify, { FastifyServerOptions } from "fastify"
import { openRoutes, authenticatedRoutes } from "./routes/routes"
import { HTTPError } from "./errors/HTTPError"
import fastifyJwt, { JWT } from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"
import env from "./env"

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT
  }
}

function buildServer(opts?: FastifyServerOptions) {
  const server = fastify(opts)

  server.setErrorHandler(async (error, req, reply) => {
    server.log.error(error)
    if (error instanceof HTTPError) {
      reply.status(error.code)
      reply.send({
        code: error.code,
        message: error.message,
      })
      return reply
    }

    reply.status(error.statusCode || 500)
    return reply.send({
      error,
    })
  })

  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Tech Blog CMS API",
        description: "Content management system for tech blog",
        version: "0.1.0",
      },
    },
  })

  server.register(swaggerUI)
  server.register(fastifyJwt, { secret: env.secret_key })
  server.register(openRoutes)
  server.register(authenticatedRoutes)

  server.addHook("preHandler", async (request) => {
    request.jwt = server.jwt
  })

  return server
}

export { buildServer }
