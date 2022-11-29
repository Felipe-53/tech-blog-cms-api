import { FastifyPluginAsync } from "fastify"
import {
  createPostData,
  createPostHandler,
} from "../controllers/createPostHandler"
import fastifyJwt from "@fastify/jwt"
import { Static, Type } from "@sinclair/typebox"
import { prisma } from "../repositories/implentations/postgres"
import { Unauthorized } from "../errors/Unauthorized"
import bcrypt from "bcrypt"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { Author } from "../entities/Author"

export const openRoutes: FastifyPluginAsync = async (app) => {
  app.register(fastifyJwt, {
    secret: process.env.SECRET_KEY!,
  })

  const loginBody = Type.Object({
    email: Type.String(),
    password: Type.String(),
  })

  const createAuthorBody = Type.Object({
    name: Type.String(),
    email: Type.String(),
    password: Type.String(),
    admin: Type.Boolean(),
  })

  type CreateAuthorBody = Static<typeof createAuthorBody>

  type LoginBody = Static<typeof loginBody>

  app.post<{ Body: LoginBody }>(
    "/login",
    {
      schema: {
        body: loginBody,
      },
    },
    async (req) => {
      const { email, password } = req.body

      const user = await prisma.dBAuthor.findUnique({
        where: {
          email,
        },
      })

      if (!user) throw new Unauthorized("Not authenticated")

      const match = await bcrypt.compare(password, user.passwordHash)
      if (!match) throw new Unauthorized("Not authenticated")

      const tokenPayload = new Author(
        user.name,
        user.email,
        user.admin,
        user.id
      )

      const token = app.jwt.sign(tokenPayload)

      return { token }
    }
  )

  app.post<{ Body: CreateAuthorBody }>(
    "/author",
    {
      schema: {
        body: createAuthorBody,
      },
    },
    async (req) => {
      const { name, email, admin, password } = req.body

      const authorRepo = new PgAuthorRepository()

      const author = await authorRepo.create({
        name,
        email,
        admin,
        password,
      })

      return author
    }
  )
}

export const authenticatedRoutes: FastifyPluginAsync = async (app) => {
  app.register(fastifyJwt, {
    secret: process.env.SECRET_KEY!,
  })

  app.addHook("onRequest", async (req, reply) => {
    try {
      req.jwtVerify()
    } catch (err) {
      return reply.send(err)
    }
  })

  app.route({
    url: "/post",
    method: "POST",
    schema: {
      body: createPostData,
    },
    handler: createPostHandler,
  })
}
