import { FastifyRequest } from "fastify"
import { Type, Static } from "@sinclair/typebox"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { Unauthorized } from "../errors/Unauthorized"
import bcrypt from "bcrypt"
import { Author } from "../entities/Author"
import { Login } from "../use-cases/Author/Login/Login"

const loginBodyData = Type.Object({
  email: Type.String(),
  password: Type.String(),
})

type LoginBodyData = Static<typeof loginBodyData>

async function loginHandler(req: FastifyRequest<{ Body: LoginBodyData }>) {
  const { email, password } = req.body

  const authorRepository = new PgAuthorRepository()

  const loginService = new Login(authorRepository, {
    hash: (password: string) => bcrypt.hash(password, 10),
    compare: bcrypt.compare,
  })

  // TODO: why is DBAuthor assignable to Author type?

  let author: Author
  try {
    author = await loginService.execute({ email, password })
  } catch {
    throw new Unauthorized("Not authenticated")
  }

  const tokenPayload = new Author(
    author.name,
    author.email,
    author.admin,
    author.id
  )

  const token = req.jwt.sign(tokenPayload)

  return { token }
}

export { loginHandler, loginBodyData }
