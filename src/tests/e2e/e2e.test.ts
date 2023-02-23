import {
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest"
import { execSync } from "child_process"
import { buildServer } from "../../server"
import { prisma } from "../../repositories/implentations/postgres"
import { PgAuthorRepository } from "../../repositories/implentations/postgres/PgAuthorRepository"
import { CreateCategory } from "../../use-cases/Category/CreateCategory/CreateCategory"
import { PgCategoryRespository } from "../../repositories/implentations/postgres/PgCategoryRepository"
import { Author } from "../../entities/Author"
import { Category } from "../../entities/Category"
import { faker } from "@faker-js/faker"
import env from "../../env"
import { CreateAuthor } from "../../use-cases/Author/CreateAuthor"
import { Post } from "../../entities/Post"
import { InputPostData } from "../../schemas/postSchema"

let server = buildServer()
let seedAuthor: Author
let seedCategory: Category

async function eraseDbData() {
  await prisma.dBCategoriesToPosts.deleteMany()
  await prisma.dBPost.deleteMany()
  await prisma.dBCategory.deleteMany()
  await prisma.dBAuthor.deleteMany()
}

beforeAll(async () => {
  const nodeEnv = env.node_env
  assert(
    nodeEnv === "test",
    `Trying to run tests in non-testing environment: '${nodeEnv}'`
  )

  execSync("npx prisma db push")

  await eraseDbData()
  await server.close()
})

beforeEach(async () => {
  const authorRepo = new PgAuthorRepository()
  const categoryRepo = new PgCategoryRespository()
  const createCategory = new CreateCategory(categoryRepo)

  const createAuthor = new CreateAuthor(authorRepo)

  seedAuthor = await createAuthor.execute({
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

test("Should NOT be able to login with incorrect credentials", async () => {
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

  const verifiedPayload = server.jwt.verify<Author & { iat: number }>(
    response.json().token
  )

  expect(verifiedPayload.email).toBe(seedAuthor.email)
  expect(verifiedPayload.name).toBe(seedAuthor.name)
  expect(verifiedPayload.admin).toBe(seedAuthor.admin)
  expect(verifiedPayload.id).toBe(seedAuthor.id)
})

test("Should NOT be able to create an author without credentials", async () => {
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

test("Should be able to create and find created post", async () => {
  const token = await getAuthenticationToken()

  const payload = {
    title: "My Blog Post",
    body: faker.lorem.sentences(5, "\n"),
    categories: [seedCategory],
    excerpt: faker.lorem.sentence(),
    ogImageUrl: faker.internet.url(),
    note: false,
  } as InputPostData

  const createPostResponse = await server.inject({
    path: "/post",
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload,
  })

  expect(createPostResponse.statusCode).toBe(201)

  const createdPost = createPostResponse.json<Post>()

  const findBySlugResponse = await server.inject({
    path: `/post/${createdPost.slug}?note=false`,
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  expect(findBySlugResponse.statusCode).toBe(200)
  expect(findBySlugResponse.json()).toStrictEqual(createdPost)

  const findAllResponse = await server.inject({
    path: "/post?note=false",
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  const findAllResponsePayload = findAllResponse.json() as Post[]

  expect(findAllResponse.statusCode).toBe(200)
  expect(Array.isArray(findAllResponsePayload)).toBe(true)
  expect(findAllResponsePayload.length).toBe(1)
  expect(findAllResponsePayload[0]).toStrictEqual(createdPost)
})

test("Should return 204 on non-existing post search", async () => {
  const token = await getAuthenticationToken()

  const findBySlugResponse = await server.inject({
    path: "/post/non-existing?note=false",
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  expect(findBySlugResponse.statusCode).toBe(204)
})

test("Should not be able to access the documentation when not authenticated in production", async () => {
  env.node_env = "production"

  const response = await server.inject({
    path: "/documentation",
  })

  expect(response.statusCode).toBe(401)

  env.node_env = "test"
})

test("Should be able to access documentation when logged in inproduction", async () => {
  env.node_env = "production"

  const token = await getAuthenticationToken()

  const response = await server.inject({
    path: "/documentation",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  expect(response.statusCode).toBe(302)
  expect(response.headers["location"]).toBe("./documentation/static/index.html")

  env.node_env = "test"
})

async function getAuthenticationToken() {
  const loginResponse = await server.inject({
    path: "/login",
    method: "POST",
    payload: {
      email: seedAuthor.email,
      password: "secret",
    },
  })

  return loginResponse.json().token as string
}
