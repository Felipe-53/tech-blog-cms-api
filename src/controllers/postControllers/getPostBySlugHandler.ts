import { Static, Type } from "@sinclair/typebox"
import { FastifyReply, FastifyRequest } from "fastify"
import { Author } from "../../entities/Author"
import { PgPostRespository } from "../../repositories/implentations/postgres/PgPostRepository"
import { GetPostQuery } from "../../schemas/postSchema"
import { FindPostBySlug } from "../../use-cases/Post/FindPostBySlug/FindPostBySlug"

const getPostPathParams = Type.Object({
  slug: Type.String(),
})

type GetPostPathParams = Static<typeof getPostPathParams>

async function getPostBySlugHandler(
  req: FastifyRequest<{ Params: GetPostPathParams; Querystring: GetPostQuery }>,
  reply: FastifyReply
) {
  // @ts-ignore
  const author = req.user as Author
  const { slug } = req.params
  const note = req.query.note

  const postRepo = new PgPostRespository()

  const findPostBySlug = new FindPostBySlug(postRepo)
  const post = await findPostBySlug.execute(slug, note)
  if (!post) return reply.status(204).send()
  return post
}

export { getPostBySlugHandler, getPostPathParams }
