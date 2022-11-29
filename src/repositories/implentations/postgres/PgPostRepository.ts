import {
  DBAuthor,
  DBCategoriesToPosts,
  DBCategory,
  DBPost,
} from "@prisma/client"
import { Post } from "../../../entities/Post"
import { IPostRepository } from "../../IPostRepository"
import { prisma } from "."
import { Author } from "../../../entities/Author"

const include = {
  author: true,
  categories: {
    include: { category: true },
  },
}
type PrismaPostEntity = DBPost & {
  author: DBAuthor
  categories: (DBCategoriesToPosts & {
    category: DBCategory
  })[]
}

function prismaToPostEntity(prismaPost: PrismaPostEntity) {
  const postEntity = new Post({
    id: prismaPost.id,
    author: {
      id: prismaPost.author.id,
      name: prismaPost.author.name,
      email: prismaPost.author.email,
      admin: prismaPost.author.admin,
    },
    body: prismaPost.body,
    excerpt: prismaPost.excerpt,
    ogImageUrl: prismaPost.ogImageUrl,
    title: prismaPost.title,
    categories: prismaPost.categories.map((cat) => {
      return {
        id: cat.categoryId,
        name: cat.category.name,
      }
    }),
  })

  return postEntity
}

export class PgPostRespository implements IPostRepository {
  async create(post: Post) {
    const cats = post.categories.map((cat) => {
      return {
        category: {
          connect: {
            id: cat.id,
          },
        },
      }
    })

    const createdPost = await prisma.dBPost.create({
      data: {
        id: post.id,
        body: post.body,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        ogImageUrl: post.ogImageUrl,
        authorId: post.author.id,
        updatedAt: null,
        categories: {
          create: [...cats],
        },
      },
      include,
    })

    return prismaToPostEntity(createdPost)
  }

  async findAllByAuthorId(authorId: string) {
    const posts = await prisma.dBPost.findMany({
      where: {
        authorId,
      },
      include,
    })
    return posts.map((post) => prismaToPostEntity(post))
  }

  async findBySlug(slug: string) {
    const post = await prisma.dBPost.findFirst({
      where: {
        slug,
      },
      include,
    })

    if (!post) return null
    return prismaToPostEntity(post)
  }

  async findById(id: string) {
    const post = await prisma.dBPost.findUnique({
      where: {
        id,
      },
      include,
    })
    if (!post) return null
    return prismaToPostEntity(post)
  }

  async update(id: string, updatedPostData: Post) {
    const updatePost = prisma.dBPost.update({
      where: {
        id,
      },
      data: {
        title: updatedPostData.title,
        body: updatedPostData.body,
        slug: updatedPostData.slug,
        authorId: updatedPostData.author.id,
        excerpt: updatedPostData.excerpt,
        ogImageUrl: updatedPostData.ogImageUrl,
        updatedAt: updatedPostData.updatedAt,
      },
    })

    const erasePreviousRelations = prisma.dBCategoriesToPosts.deleteMany({
      where: {
        postId: updatedPostData.id,
      },
    })

    const createNewRelations = prisma.dBCategoriesToPosts.createMany({
      data: updatedPostData.categories.map((cat) => {
        return {
          postId: updatedPostData.id,
          categoryId: cat.id,
        }
      }),
    })

    await prisma.$transaction([
      updatePost,
      erasePreviousRelations,
      createNewRelations,
    ])

    return updatedPostData
  }

  async delete(id: string) {
    await prisma.dBPost.delete({
      where: {
        id,
      },
    })
  }
}
