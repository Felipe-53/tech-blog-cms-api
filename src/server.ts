import fastify from "fastify"
import { openRoutes, authenticatedRoutes } from "./routes/routes"
import { HTTPError } from "./errors/HTTPError"

function buildServer({ logger } = { logger: false }) {
  const server = fastify({
    logger,
  })

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

  server.register(openRoutes)
  server.register(authenticatedRoutes)

  return server
}

export { buildServer }
