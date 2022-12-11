import { Static, Type } from "@sinclair/typebox"
import { FastifyRequest } from "fastify"
import { Author } from "../entities/Author"
import { PgPostRespository } from "../repositories/implentations/postgres/PgPostRepository"
import { FindAllPosts } from "../use-cases/Post/FindAllPosts/FindAllPosts"
import { FindPostBySlug } from "../use-cases/Post/FindPostBySlug/FindPostBySlug"

const getPostQueryParams = Type.Object({
  slug: Type.Optional(Type.String()),
})

type GetPostQueryParams = Static<typeof getPostQueryParams>

async function getPostHandler(
  req: FastifyRequest<{ Querystring: GetPostQueryParams }>
) {
  // @ts-ignore
  const author = req.user as Author

  const postRepo = new PgPostRespository()

  let slug: string | undefined
  if ((slug = req.query.slug)) {
    const findPostBySlug = new FindPostBySlug(postRepo)
    // TODO: add authorId to the search
    const post = await findPostBySlug.execute(slug)
    if (post) return post
  }

  const findAllPosts = new FindAllPosts(postRepo)
  const posts = await findAllPosts.execute(author.id)

  return posts
}

export { getPostHandler, getPostQueryParams }
