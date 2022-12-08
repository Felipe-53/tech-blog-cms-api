import { FastifyReply, FastifyRequest } from "fastify"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { Type, Static } from "@sinclair/typebox"
import { Unauthorized } from "../errors/Unauthorized"
import env from "../env"
import bcrypt from "bcrypt"
import { CreateAuthor } from "../use-cases/Author/CreateAuthor"

const createAuthorBody = Type.Object({
  name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  admin: Type.Boolean(),
})

type CreateAuthorBody = Static<typeof createAuthorBody>

async function createAuthorHandler(
  req: FastifyRequest<{ Body: CreateAuthorBody }>,
  reply: FastifyReply
) {
  const { name, email, admin, password } = req.body

  const authorRepository = new PgAuthorRepository()

  const createAuthor = new CreateAuthor(authorRepository)

  const author = await createAuthor.execute({
    name,
    email,
    admin,
    password,
  })

  reply.status(201)

  return author
}

async function createAuthorOnRequestHook(req: FastifyRequest) {
  const key = req.headers["x-secret-key"]
  if (key !== env.secret_key) {
    throw new Unauthorized()
  }
}

export { createAuthorHandler, createAuthorBody, createAuthorOnRequestHook }
