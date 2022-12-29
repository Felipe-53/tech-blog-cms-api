import { FastifyPluginAsync } from "fastify"
import { loginHandler } from "../controllers/authorControllers/loginHandler"
import { createAuthorHandler } from "../controllers/authorControllers/createAuthorHandler"
import { simpleAuthHook } from "../hooks/simpleAuthHook"
import {
  simpleAuthHeaderSchema,
  unauthorizedResponseSchema,
} from "../controllers/controllerSchemas"
import {
  inputAuthorDataSchema,
  loginDataSchema,
  loginResponseSchema,
  serializedAuthorDataSchema,
} from "../schemas/authorSchema"

export const authorRoutes: FastifyPluginAsync = async (app) => {
  app.route({
    url: "/login",
    method: "POST",
    schema: {
      body: loginDataSchema,
      response: {
        401: unauthorizedResponseSchema,
        200: loginResponseSchema,
      },
    },
    handler: loginHandler,
  })

  app.route({
    url: "/author",
    method: "POST",
    schema: {
      headers: simpleAuthHeaderSchema,
      body: inputAuthorDataSchema,
      response: {
        200: serializedAuthorDataSchema,
        401: unauthorizedResponseSchema,
      },
    },
    onRequest: simpleAuthHook,
    handler: createAuthorHandler,
  })
}
