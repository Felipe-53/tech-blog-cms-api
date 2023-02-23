import { Post } from "../entities/Post"

export type CreatePostDTO = Omit<
  Post,
  "id" | "categories" | "createdAt" | "updatedAt" | "slug" | "toJSON"
> & {
  categories: {
    id: string
  }[]
}
