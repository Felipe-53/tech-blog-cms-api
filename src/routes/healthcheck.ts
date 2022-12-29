import { FastifyPluginAsync } from "fastify"
import { simpleAuthHook } from "../hooks/simpleAuthHook"
import { Type } from "@sinclair/typebox"
import { UnauthorizedResponse } from "../controllers/schemas"

export const healthcheckRoute: FastifyPluginAsync = async (app) => {
  app.route({
    url: "/healthcheck",
    method: "GET",
    schema: {
      headers: Type.Object({
        "X-Secret-Key": Type.String(),
      }),
      response: {
        200: Type.Object({
          ok: Type.Boolean({ default: true }),
        }),
        401: UnauthorizedResponse,
      },
    },
    onRequest: simpleAuthHook,
    handler: async () => {
      return { ok: true }
    },
  })
}
