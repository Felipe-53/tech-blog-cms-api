import { FastifyPluginAsync } from "fastify"
import {
  createCategoryData,
  createCategoryHandler,
} from "../controllers/createCategoryHandler"
import { getCategoryHandler } from "../controllers/getCateoryHandler"
import { jwtAuthHook } from "../hooks/jwtAuthHook"

export const categoryRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", jwtAuthHook)

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
