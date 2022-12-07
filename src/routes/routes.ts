import { FastifyPluginAsync } from "fastify"
import {
  createPostData,
  createPostHandler,
} from "../controllers/createPostHandler"
import { Static, Type } from "@sinclair/typebox"
import { Unauthorized } from "../errors/Unauthorized"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import {
  createCategoryData,
  createCategoryHandler,
} from "../controllers/createCategoryHandler"
import { getCategoryHandler } from "../controllers/getCateoryHandler"
import {
  getPostHandler,
  getPostQueryParams,
} from "../controllers/getPostHandler"
import env from "../env"
import { loginBodyData, loginHandler } from "../controllers/loginHandler"

export const openRoutes: FastifyPluginAsync = async (app) => {
  const createAuthorBody = Type.Object({
    name: Type.String(),
    email: Type.String(),
    password: Type.String(),
    admin: Type.Boolean(),
  })

  type CreateAuthorBody = Static<typeof createAuthorBody>

  app.route({
    url: "/login",
    method: "POST",
    schema: {
      body: loginBodyData,
    },
    handler: loginHandler,
  })

  type CreateAuthorHeaders = {
    "x-secret-key": string
  }

  app.post<{ Body: CreateAuthorBody; Headers: CreateAuthorHeaders }>(
    "/author",
    {
      schema: {
        body: createAuthorBody,
      },
      onRequest: async (req) => {
        const key = req.headers["x-secret-key"]
        if (key !== env.secret_key) {
          throw new Unauthorized()
        }
      },
    },
    async (req, reply) => {
      const { name, email, admin, password } = req.body

      const authorRepo = new PgAuthorRepository()

      const author = await authorRepo.create({
        name,
        email,
        admin,
        password,
      })

      reply.status(201)

      return author
    }
  )
}

export const authenticatedRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (req) => {
    try {
      await req.jwtVerify()
    } catch (err) {
      throw new Unauthorized("Token malformed or abscent")
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

  app.route({
    url: "/post",
    method: "GET",
    schema: {
      querystring: getPostQueryParams,
    },
    handler: getPostHandler,
  })

  app.route({
    url: "/category",
    method: "POST",
    schema: {
      body: createCategoryData,
    },
    handler: createCategoryHandler,
  })

  app.route({
    url: "/category",
    method: "GET",
    handler: getCategoryHandler,
  })
}
