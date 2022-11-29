import fastify from "fastify"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { execSync } from "child_process"
import { prisma } from "./repositories/implentations/postgres"
import { openRoutes, authenticatedRoutes } from "./routes/routes"
import { HTTPError } from "./errors/HTTPError"

const app = fastify({
  logger: true,
})

app.setErrorHandler(async (error, req, reply) => {
  app.log.error(error)
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
async function start() {
  await prisma.$connect()

  try {
    await prisma.dBPost.findFirst()
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2021") {
      console.log("Pushing schema to db...")
      execSync("npx prisma db push")
    } else {
      throw err
    }
  }

  app.register(openRoutes)
  app.register(authenticatedRoutes)

  app.listen({
    port: 3500,
  })
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})
