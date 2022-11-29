import { FastifyRequest } from "fastify"
import { Type, Static } from "@sinclair/typebox"
import { CreatePost } from "../use-cases/Post/CreatePost/CreatePost"
import { PgPostRespository } from "../repositories/implentations/postgres/PgPostRepository"
import { PgCategoryRespository } from "../repositories/implentations/postgres/PgCategoryRepository"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { Author } from "../entities/Author"

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

  const post = await createPost.execute({
    author,
    categories,
    excerpt,
    ogImageUrl,
    body,
    title,
  })

  return post
}

export { createPostHandler, createPostData }
