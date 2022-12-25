import { FastifyPluginAsync } from "fastify"
import {
  createPostData,
  createPostHandler,
} from "../controllers/createPostHandler"
import { Unauthorized } from "../errors/Unauthorized"
import {
  createCategoryData,
  createCategoryHandler,
} from "../controllers/createCategoryHandler"
import { getCategoryHandler } from "../controllers/getCateoryHandler"
import {
  getPostBySlugHandler,
  getPostPathParams,
} from "../controllers/getPostBySlugHandler"
import { loginBodyData, loginHandler } from "../controllers/loginHandler"
import {
  createAuthorBody,
  createAuthorHandler,
} from "../controllers/createAuthorHandler"
import { simpleAuthHook } from "../hooks/simpleAuthHook"
import { getPostsHandler } from "../controllers/getPostsHandler"
import { vercelIntegrationHook } from "../hooks/vercelIntegrationHook"

export const openRoutes: FastifyPluginAsync = async (app) => {
  app.route({
    url: "/healthcheck",
    method: "GET",
    onRequest: simpleAuthHook,
    handler: async () => {
      return { ok: true }
    },
  })

  app.route({
    url: "/login",
    method: "POST",
    schema: {
      body: loginBodyData,
    },
    handler: loginHandler,
  })

  app.route({
    url: "/author",
    method: "POST",
    schema: {
      body: createAuthorBody,
    },
    onRequest: simpleAuthHook,
    handler: createAuthorHandler,
  })
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
    onResponse: vercelIntegrationHook,
    handler: createPostHandler,
  })

  app.route({
    url: "/post",
    method: "GET",
    handler: getPostsHandler,
  })

  app.route({
    url: "/post/:slug",
    method: "GET",
    schema: {
      params: getPostPathParams,
    },
    handler: getPostBySlugHandler,
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
