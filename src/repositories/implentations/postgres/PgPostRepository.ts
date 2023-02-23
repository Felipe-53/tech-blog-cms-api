import {
  DBAuthor,
  DBCategoriesToPosts,
  DBCategory,
  DBPost,
} from "@prisma/client"
import { Post } from "../../../entities/Post"
import { IPostRepository } from "../../IPostRepository"
import { prisma } from "."

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
    createdAt: prismaPost.createdAt,
    updatedAt: prismaPost.updatedAt,
    title: prismaPost.title,
    body: prismaPost.body,
    slug: prismaPost.slug,
    excerpt: prismaPost.excerpt,
    author: {
      id: prismaPost.author.id,
      name: prismaPost.author.name,
      email: prismaPost.author.email,
      admin: prismaPost.author.admin,
    },
    note: prismaPost.note,
    ogImageUrl: prismaPost.ogImageUrl,
    categories: prismaPost.categories.map((cat) => {
      return {
        id: cat.categoryId,
        name: cat.category.name,
        note: cat.category.note,
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
        createdAt: post.createdAt,
        updatedAt: null,
        note: post.note,
        categories: {
          create: [...cats],
        },
      },
      include,
    })

    return prismaToPostEntity(createdPost)
  }

  async findAllByAuthorId(authorId: string, note: boolean) {
    const posts = await prisma.dBPost.findMany({
      where: {
        authorId,
        note,
      },
      include,
    })
    return posts.map((post) => prismaToPostEntity(post))
  }

  async findBySlug(slug: string, note: boolean) {
    const post = await prisma.dBPost.findFirst({
      where: {
        slug,
        note,
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
