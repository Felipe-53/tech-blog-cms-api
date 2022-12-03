import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { execSync } from "child_process"
import { prisma } from "./repositories/implentations/postgres"
import { buildServer } from "./server"

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

  const app = buildServer()

  await app.listen({
    port: 3500,
    host: "0.0.0.0",
  })
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})
