import { Post } from "../../../entities/Post"
import { IPostRepository } from "../../../repositories/IPostRepository"
import data from "./inMemoryData"

export class InMemoryPostRespository implements IPostRepository {
  async create(post: Post) {
    data.posts.push(post)
    return post
  }

  async findAllByAuthorId(authorId: string) {
    const posts = data.posts.filter((post) => post.author.id === authorId)
    return posts
  }

  async findBySlug(slug: string) {
    const post = data.posts.find((post) => post.slug === slug)
    if (!post) return null
    return post
  }

  async findById(id: string) {
    const post = data.posts.find((post) => post.id === id)
    if (!post) return null
    return post
  }

  async update(id: string, updatedPostData: Post) {
    const post = data.posts.find((post) => post.id === id)
    if (!post) throw Error(`Could not find post with id ${id}`)
    for (const prop of Object.keys(updatedPostData) as Array<keyof Post>) {
      if (updatedPostData[prop]) {
        // @ts-ignore
        post[prop] = updatedPostData[prop]
      }
    }
    return post
  }

  async delete(id: string) {
    let previousLegth = data.posts.length
    data.posts = data.posts.filter((post) => post.id !== id)
    let newLength = data.posts.length
    if (previousLegth === newLength) {
      throw Error(`Trying to delete unexisting post with id ${id}`)
    }
  }
}
