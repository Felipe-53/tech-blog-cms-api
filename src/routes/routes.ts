import { FastifyPluginAsync } from "fastify"
import {
  createPostData,
  createPostHandler,
} from "../controllers/createPostHandler"

export const routes: FastifyPluginAsync = async (app) => {
  app.route({
    url: "/post",
    method: "POST",
    schema: {
      body: createPostData,
    },
    handler: createPostHandler,
  })
}
