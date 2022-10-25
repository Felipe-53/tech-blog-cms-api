import { Category } from '../entities/Category/Category'
import { Post } from '../entities/Post'

export interface UpdatePostData {
  title?: string
  body?: string
  excerpt?: string
  categories?: Category[]
  ogImageUrl?: string
}

export interface IPostRepository {
  create: (post: Post) => Promise<Post>
  findAllByAuthorId: (authorId: string) => Promise<Post[]>   
  findBySlug: (slug: string) => Promise<Post | null>
  update: (id: string, data: UpdatePostData) => Promise<Post>
}
