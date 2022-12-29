import { FastifyRequest } from "fastify"
import { PgPostRespository } from "../../repositories/implentations/postgres/PgPostRepository"
import { FindAllPosts } from "../../use-cases/Post/FindAllPosts/FindAllPosts"

async function getPostsHandler(req: FastifyRequest) {
  // @ts-ignore
  const authorId = req.user.id
  const postRepo = new PgPostRespository()
  const findAllPosts = new FindAllPosts(postRepo)
  const posts = await findAllPosts.execute(authorId)
  return posts
}

export { getPostsHandler }
