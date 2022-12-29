import { FastifyPluginAsync } from "fastify"
import { createPostHandler } from "../controllers/createPostHandler"
import {
  getPostBySlugHandler,
  getPostPathParams,
} from "../controllers/getPostBySlugHandler"
import { getPostsHandler } from "../controllers/getPostsHandler"
import { vercelIntegrationHook } from "../hooks/vercelIntegrationHook"
import { jwtAuthHook } from "../hooks/jwtAuthHook"
import {
  inputPostDataSchema,
  serializedPostDataSchema,
} from "../schemas/postSchema"
import { BadRequestResponse } from "../controllers/schemas"
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
        400: BadRequestResponse,
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
    },
    handler: getPostBySlugHandler,
  })
}
