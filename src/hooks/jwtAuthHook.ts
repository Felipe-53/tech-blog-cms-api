import { FastifyRequest } from "fastify"
import { Unauthorized } from "../errors/Unauthorized"

export async function jwtAuthHook(req: FastifyRequest) {
  try {
    await req.jwtVerify()
  } catch (err) {
    throw new Unauthorized("Token malformed or abscent")
  }
}
