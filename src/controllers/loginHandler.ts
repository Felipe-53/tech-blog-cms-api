import { FastifyRequest } from "fastify"
import { Type, Static } from "@sinclair/typebox"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { Unauthorized } from "../errors/Unauthorized"
import bcrypt from "bcrypt"
import { Author } from "../entities/Author"

const loginBodyData = Type.Object({
  email: Type.String(),
  password: Type.String(),
})

type LoginBodyData = Static<typeof loginBodyData>

async function loginHandler(req: FastifyRequest<{ Body: LoginBodyData }>) {
  const { email, password } = req.body

  const authorRepository = new PgAuthorRepository()

  const user = await authorRepository.findByEmail(email)

  if (!user) throw new Unauthorized("Not authenticated")

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) throw new Unauthorized("Not authenticated")

  const tokenPayload = new Author(user.name, user.email, user.admin, user.id)

  const token = req.jwt.sign(tokenPayload)

  return { token }
}

export { loginHandler, loginBodyData }
