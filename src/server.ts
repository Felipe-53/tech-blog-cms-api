import fastify, { FastifyServerOptions } from "fastify"
import { HTTPError } from "./errors/HTTPError"
import fastifyJwt, { JWT } from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"
import env from "./env"
import { jwtAuthHook } from "./hooks/jwtAuthHook"
import { authorRoutes } from "./routes/authorRoutes"
import { postRoutes } from "./routes/postRoutes"
import { categoryRoutes } from "./routes/categoryRoutes"
import { healthcheckRoute } from "./routes/healthcheck"

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT
  }
}

function buildServer(opts?: FastifyServerOptions) {
  const { secret_key } = env

  const server = fastify(opts)

  server.setErrorHandler(async (error, req, reply) => {
    server.log.error(error)

    if (error instanceof HTTPError) {
      reply.status(error.code)
      reply.send({
        error: error.message,
      })
      return reply
    }

    reply.status(error.statusCode || 500)
    return reply.send({
      error,
    })
  })

  server.register(fastifyJwt, { secret: secret_key })

  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Tech Blog CMS API",
        description: "Content management system for tech blog",
        version: "0.1.0",
      },
    },
  })

  server.register(swaggerUI, {
    uiHooks: {
      onRequest: async (request) => {
        if (env.node_env === "production") {
          await jwtAuthHook(request)
        }
      },
    },
  })

  server.register(healthcheckRoute)
  server.register(authorRoutes)
  server.register(postRoutes)
  server.register(categoryRoutes)

  server.get("/boom", async () => {
    throw new Error("kaboom")
  })

  server.addHook("preHandler", async (request) => {
    request.jwt = server.jwt
  })

  return server
}

export { buildServer }
