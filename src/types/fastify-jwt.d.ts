import "@fastify/jwt"
import { Author } from "../entities/Author"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: Author // payload type is used for signing and verifying
    user: Author // user type is return type of `request.user` object
  }
}
