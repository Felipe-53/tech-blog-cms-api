import { FastifyReply, FastifyRequest } from "fastify"
import {
  CreatePost,
  InconsistentData,
} from "../../use-cases/Post/CreatePost/CreatePost"
import { PgPostRespository } from "../../repositories/implentations/postgres/PgPostRepository"
import { PgCategoryRespository } from "../../repositories/implentations/postgres/PgCategoryRepository"
import { PgAuthorRepository } from "../../repositories/implentations/postgres/PgAuthorRepository"
import { Author } from "../../entities/Author"
import { Post } from "../../entities/Post"
import { BadRequest } from "../../errors/BadRequest"
import { InputPostData } from "../../schemas/postSchema"
import env from "../../env"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"
import { SQSService } from "../../use-cases/SQS/SQSSevice"

async function createPostHandler(
  req: FastifyRequest<{ Body: InputPostData }>,
  reply: FastifyReply
) {
  const postRepo = new PgPostRespository()
  const categoryRepo = new PgCategoryRespository()
  const authorRepo = new PgAuthorRepository()

  const createPost = new CreatePost(postRepo, categoryRepo, authorRepo)

  const author = req.user as Author
  const { title, body, categories, excerpt, ogImageUrl, note } = req.body

  let post: Post
  try {
    post = await createPost.execute({
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        admin: author.admin,
      },
      categories,
      excerpt,
      ogImageUrl,
      body,
      title,
      note,
    })
  } catch (err) {
    if (err instanceof InconsistentData) {
      throw new BadRequest(err.message)
    }
    throw err
  }

  if (env.node_env === "production") {
    const urlPathComponent = post.note ? "tech-notes" : "artigos"

    SQSService.sendMessage({
      title: post.title,
      excerpt: post.excerpt,
      link: `https://felipebarbosa.dev/${urlPathComponent}/${post.slug}`,
    })
      .then((response) => {
        reply.log.info(response)
      })
      .catch((err) => {
        reply.log.error(err)
      })
  }

  reply.status(201)
  return post
}

export { createPostHandler }
