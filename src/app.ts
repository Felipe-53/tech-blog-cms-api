import fastify from "fastify"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { execSync } from "child_process"
import { prisma } from "./repositories/implentations/postgres"
import { routes } from "./routes/routes"

const app = fastify({
  logger: true,
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

  app.register(routes)

  app.listen(3500, (err, addr) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log("listening on addr: ", addr)
  })
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})
