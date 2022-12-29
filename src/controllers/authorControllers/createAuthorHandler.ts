import { FastifyReply, FastifyRequest } from "fastify"
import { PgAuthorRepository } from "../../repositories/implentations/postgres/PgAuthorRepository"
import { InputAuthorData } from "../../schemas/authorSchema"
import { CreateAuthor } from "../../use-cases/Author/CreateAuthor"

async function createAuthorHandler(
  req: FastifyRequest<{ Body: InputAuthorData }>,
  reply: FastifyReply
) {
  const { name, email, admin, password } = req.body

  const authorRepository = new PgAuthorRepository()

  const createAuthor = new CreateAuthor(authorRepository)

  const author = await createAuthor.execute({
    name,
    email,
    admin,
    password,
  })

  reply.status(201)

  return author
}

export { createAuthorHandler }
