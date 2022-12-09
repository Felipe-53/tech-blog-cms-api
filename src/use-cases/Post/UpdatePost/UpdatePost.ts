import { Category } from "../../../entities/Category"
import { Post } from "../../../entities/Post"
import { IPostRepository } from "../../../repositories/IPostRepository"

export interface UpdatePostData {
  title?: string
  body?: string
  excerpt?: string
  categories?: Category[]
  ogImageUrl?: string
}

export class UpdatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: string, data: UpdatePostData): Promise<Post> {
    const post = await this.postRepository.findById(id)
    if (!post) throw Error(`Post with id ${id} not found`)
    for (const prop of Object.keys(data) as Array<keyof UpdatePostData>) {
      if (data[prop]) {
        // @ts-ignore
        post[prop] = data[prop]
      }
    }
    this.postRepository.update(id, post)
    return post
  }
}
