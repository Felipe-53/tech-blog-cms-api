import { PrismaClient } from "@prisma/client"
import env from "../../../env"

const databaseUrl = env.database_url
const testDatabaseName = "testing"

if (env.node_env === "test" && !databaseUrl.includes("testing")) {
  process.stderr.write(
    `Trying to run tests in a database not called '${testDatabaseName}'\n`
  )
  process.exit(1)
}

const prisma = new PrismaClient()

export { prisma }
