import { FastifyPluginAsync } from "fastify"
import { loginHandler } from "../controllers/loginHandler"
import { createAuthorHandler } from "../controllers/createAuthorHandler"
import { simpleAuthHook } from "../hooks/simpleAuthHook"
import { UnauthorizedResponse } from "../controllers/schemas"
import {
  inputAuthorDataSchema,
  loginDataSchema,
  loginResponseSchema,
  serializedAuthorDataSchema,
} from "../schemas/authorSchema"
import { Type } from "@sinclair/typebox"

export const authorRoutes: FastifyPluginAsync = async (app) => {
  app.route({
    url: "/login",
    method: "POST",
    schema: {
      body: loginDataSchema,
      response: {
        401: UnauthorizedResponse,
        200: loginResponseSchema,
      },
    },
    handler: loginHandler,
  })

  app.route({
    url: "/author",
    method: "POST",
    schema: {
      headers: Type.Object({
        "x-secre-key": Type.String(),
      }),
      body: inputAuthorDataSchema,
      response: {
        200: serializedAuthorDataSchema,
        401: UnauthorizedResponse,
      },
    },
    onRequest: simpleAuthHook,
    handler: createAuthorHandler,
  })
}
