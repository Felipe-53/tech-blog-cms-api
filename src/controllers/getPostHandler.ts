import { Static, Type } from "@sinclair/typebox"
import { FastifyRequest } from "fastify"
import { Author } from "../entities/Author"
import { BadRequest } from "../errors/BadRequest"
import { PgPostRespository } from "../repositories/implentations/postgres/PgPostRepository"
import { FindAllPosts } from "../use-cases/Post/FindAllPosts/FindAllPosts"
import { FindPostBySlug } from "../use-cases/Post/FindPostBySlug/FindPostBySlug"

const getPostPathParams = Type.Object({
  slug: Type.Optional(Type.String()),
})

type GetPostPathParams = Static<typeof getPostPathParams>

async function getPostHandler(
  req: FastifyRequest<{ Params: GetPostPathParams }>
) {
  // @ts-ignore
  const author = req.user as Author

  const postRepo = new PgPostRespository()

  if (req.params.slug) {
    const { slug } = req.params
    const findPostBySlug = new FindPostBySlug(postRepo)
    // TODO: add authorId to the search
    const post = await findPostBySlug.execute(slug)
    if (!post) throw new BadRequest(`Post with slug ${slug} not found`)
    return post
  }

  const findAllPosts = new FindAllPosts(postRepo)
  const posts = await findAllPosts.execute(author.id)

  return posts
}

export { getPostHandler, getPostPathParams }
