import { FastifyRequest } from "fastify"
import env from "../env"
import { Unauthorized } from "../errors/Unauthorized"

export async function simpleAuthHook(req: FastifyRequest) {
  const key = req.headers["x-secret-key"]
  if (key !== env.secret_key) {
    throw new Unauthorized()
  }
}
