import { FastifyPluginAsync } from "fastify"
import { createCategoryHandler } from "../controllers/categoryControllers/createCategoryHandler"
import { getCategoryHandler } from "../controllers/categoryControllers/getCateoryHandler"
import { jwtAuthHook } from "../hooks/jwtAuthHook"
import {
  inputCategoryDataSchema,
  querystringCategoryDataSchema,
} from "../schemas/categorySchema"

export const categoryRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", jwtAuthHook)

  app.route({
    url: "/category",
    method: "POST",
    schema: {
      body: inputCategoryDataSchema,
    },
    handler: createCategoryHandler,
  })

  app.route({
    url: "/category",
    method: "GET",
    handler: getCategoryHandler,
    schema: {
      querystring: querystringCategoryDataSchema,
    },
  })
}
