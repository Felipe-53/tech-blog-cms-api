import { afterEach, assert, beforeAll, beforeEach, expect, test } from "vitest"
import { execSync } from "child_process"
import { buildServer } from "../../server"
import { prisma } from "../../repositories/implentations/postgres"
import { PgAuthorRepository } from "../../repositories/implentations/postgres/PgAuthorRepository"
import { CreateCategory } from "../../use-cases/Category/CreateCategory/CreateCategory"
import { PgCategoryRespository } from "../../repositories/implentations/postgres/PgCategoryRepository"
import { Author } from "../../entities/Author"
import { Category } from "../../entities/Category"
import { config as loadEnv } from "dotenv"
import { FastifyInstance } from "fastify"
import { faker } from "@faker-js/faker"
import env from "../../env"

const result = loadEnv()
if (result.error) {
  console.error(result.error)
  process.exit(1)
}

let server: FastifyInstance
let seedAuthor: Author
let seedCategory: Category

async function eraseDbData() {
  await prisma.dBCategoriesToPosts.deleteMany()
  await prisma.dBPost.deleteMany()
  await prisma.dBCategory.deleteMany()
  await prisma.dBAuthor.deleteMany()
}

beforeAll(async () => {
  const nodeEnv = env.secret_key
  assert(
    nodeEnv === "test",
    `Trying to run tests in non-testing environment: '${nodeEnv}'`
  )

  execSync("npx prisma db push")

  await eraseDbData()
})

beforeEach(async () => {
  const authorRepo = new PgAuthorRepository()
  const categoryRepo = new PgCategoryRespository()
  const createCategory = new CreateCategory(categoryRepo)

  seedAuthor = await authorRepo.create({
    name: "Felipe",
    email: "felipe@email.com",
    password: "secret",
    admin: true,
  })

  seedCategory = await createCategory.execute({
    name: "TypeScript",
  })

  server = buildServer()
})

afterEach(async () => {
  await server.close()
  await eraseDbData()
})

test("Should not be able to login with incorrect credentials", async () => {
  const response = await server.inject({
    path: "/login",
    method: "POST",
    payload: {
      email: "non-existing",
      password: "pass",
    },
  })
  expect(response.statusCode).toBe(401)
})

test("Should be able to login with correct credentials", async () => {
  const response = await server.inject({
    path: "/login",
    method: "POST",
    payload: {
      email: seedAuthor.email,
      password: "secret",
    },
  })
  expect(response.statusCode).toBe(200)
  expect(response.json().token).toBeTypeOf("string")
})

test("Should not be able to create an author without credentials", async () => {
  const response = await server.inject({
    path: "/author",
    method: "POST",
    payload: {
      email: faker.internet.email(),
      name: faker.name.fullName(),
      password: faker.internet.password(),
      admin: true,
    },
  })
  expect(response.statusCode).toBe(401)
})

test("Should be able to create an author providing correct credentials", async () => {
  const payload = {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password: faker.internet.password(),
    admin: true,
  }

  const response = await server.inject({
    path: "/author",
    method: "POST",
    headers: {
      "X-Secret-Key": env.secret_key,
    },
    payload,
  })
  expect(response.statusCode).toBe(201)
  expect(response.json().id).toBeTypeOf("string")
})
