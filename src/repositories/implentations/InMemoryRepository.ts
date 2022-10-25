import { Post } from '../../entities/Post'
import { IPostRepository, UpdatePostData } from "../IPostRepository";

export class InMemoryRespository implements IPostRepository {
  private posts: Post[] = []

  async create(post: Post) {
    this.posts.push(post)
    return post
  }

  async findAllByAuthorId(authorId: string) {
    const posts = this.posts.filter(post => post.author.id === authorId)
    return posts
  }

  async findBySlug(slug: string) {
    const post = this.posts.find(post => post.slug === slug)
    if (!post) return null
    return post
  }

  async update(id: string, data: UpdatePostData) {
    const post = this.posts.find(post => post.id === id)
    if (!post) throw Error(`Could not find post with id ${id}`)
    for (const prop of Object.keys(data)) {
      if (data[prop]) {
        post[prop] = data[prop]
      }
    }
    return post
  }
}
