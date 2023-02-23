import { FastifyRequest } from "fastify"
import { PgPostRespository } from "../../repositories/implentations/postgres/PgPostRepository"
import { GetPostQuery } from "../../schemas/postSchema"
import { FindAllPosts } from "../../use-cases/Post/FindAllPosts/FindAllPosts"

async function getPostsHandler(
  req: FastifyRequest<{ Querystring: GetPostQuery }>
) {
  // @ts-ignore
  const authorId = req.user.id
  const note = req.query.note
  const postRepo = new PgPostRespository()
  const findAllPosts = new FindAllPosts(postRepo)
  const posts = await findAllPosts.execute(authorId, note)
  return posts
}

export { getPostsHandler }
