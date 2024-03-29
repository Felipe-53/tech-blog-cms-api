import { Post } from "../entities/Post"
export interface IPostRepository {
  create: (post: Post) => Promise<Post>
  findAllByAuthorId: (authorId: string, note: boolean) => Promise<Post[]>
  findBySlug: (slug: string) => Promise<Post | null>
  findById: (id: string) => Promise<Post | null>
  update: (id: string, data: Post) => Promise<Post>
  delete: (id: string) => Promise<void>
}
