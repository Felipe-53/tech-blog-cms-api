import { FastifyPluginAsync } from "fastify"
import { simpleAuthHook } from "../hooks/simpleAuthHook"
import { Type } from "@sinclair/typebox"
import { simpleAuthHeaderSchema } from "../controllers/controllerSchemas"

export const healthcheckRoute: FastifyPluginAsync = async (app) => {
  app.route({
    url: "/healthcheck",
    method: "GET",
    schema: {
      headers: simpleAuthHeaderSchema,
      response: {
        200: Type.Object({
          ok: Type.Boolean({ default: true }),
        }),
      },
    },
    onRequest: simpleAuthHook,
    handler: async () => {
      return { ok: true }
    },
  })
}
