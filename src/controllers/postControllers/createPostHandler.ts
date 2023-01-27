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

async function createPostHandler(
  req: FastifyRequest<{ Body: InputPostData }>,
  reply: FastifyReply
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
    })
  } catch (err) {
    if (err instanceof InconsistentData) {
      throw new BadRequest(err.message)
    }
    throw err
  }

  if (env.node_env === "production") {
    const client = new SQSClient({ region: "sa-east-1" })
    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: env.aws_sqs_queue_url,
      MessageBody: JSON.stringify({
        title: post.title,
        excerpt: post.excerpt,
        link: `https://felipebarbosa.dev/artigos/${post.slug}`,
      }),
    })
    client
      .send(sendMessageCommand)
      .then(() => reply.log.info("Successfully sent message to SQS"))
      .catch((err) => {
        reply.log.error("Failed to send message do SQS")
        reply.log.error(err)
      })
  }

  reply.status(201)
  return post
}

export { createPostHandler }
