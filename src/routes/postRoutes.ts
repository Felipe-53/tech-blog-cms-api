import { FastifyPluginAsync } from "fastify"
import { createPostHandler } from "../controllers/postControllers/createPostHandler"
import {
  getPostBySlugHandler,
  getPostPathParams,
} from "../controllers/postControllers/getPostBySlugHandler"
import { getPostsHandler } from "../controllers/postControllers/getPostsHandler"
import { vercelIntegrationHook } from "../hooks/vercelIntegrationHook"
import { jwtAuthHook } from "../hooks/jwtAuthHook"
import {
  getPostQuerySchema,
  inputPostDataSchema,
  serializedPostDataSchema,
} from "../schemas/postSchema"
import { Type } from "@sinclair/typebox"

export const postRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", jwtAuthHook)

  app.route({
    url: "/post",
    method: "POST",
    schema: {
      body: inputPostDataSchema,
      response: {
        201: serializedPostDataSchema,
      },
    },
    onResponse: vercelIntegrationHook,
    handler: createPostHandler,
  })

  app.route({
    url: "/post",
    method: "GET",
    schema: {
      response: {
        200: Type.Array(serializedPostDataSchema),
      },
      querystring: getPostQuerySchema,
    },
    handler: getPostsHandler,
  })

  app.route({
    url: "/post/:slug",
    method: "GET",
    schema: {
      params: getPostPathParams,
      response: {
        200: serializedPostDataSchema,
      },
      querystring: getPostQuerySchema,
    },
    handler: getPostBySlugHandler,
  })
}
