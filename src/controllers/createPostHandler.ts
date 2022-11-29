import { FastifyRequest } from "fastify"
import { Type, Static } from "@sinclair/typebox"
import {
  CreatePost,
  InconsistentData,
} from "../use-cases/Post/CreatePost/CreatePost"
import { PgPostRespository } from "../repositories/implentations/postgres/PgPostRepository"
import { PgCategoryRespository } from "../repositories/implentations/postgres/PgCategoryRepository"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { Author } from "../entities/Author"
import { Post } from "../entities/Post"
import { BadRequest } from "../errors/BadRequest"

const createPostData = Type.Object({
  body: Type.String(),
  title: Type.String(),
  excerpt: Type.String(),
  categories: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    })
  ),
  ogImageUrl: Type.String(),
})

type CreatePostDataType = Static<typeof createPostData>

async function createPostHandler(
  req: FastifyRequest<{ Body: CreatePostDataType }>
) {
  const postRepo = new PgPostRespository()
  const categoryRepo = new PgCategoryRespository()
  const authorRepo = new PgAuthorRepository()

  const createPost = new CreatePost(postRepo, categoryRepo, authorRepo)

  const author = req.user as Author
  const { title, body, categories, excerpt, ogImageUrl } = req.body

  let post: Post
  try {
    post = await createPost.execute({
      author,
      categories,
      excerpt,
      ogImageUrl,
      body,
      title,
    })
  } catch (err) {
    if (err instanceof InconsistentData) {
      throw new BadRequest(err.message)
    }
    throw err
  }

  return post
}

export { createPostHandler, createPostData }
