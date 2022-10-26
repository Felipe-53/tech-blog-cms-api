import { Category } from "../../../entities/Category/Category";
import { Post } from "../../../entities/Post";
import { IPostRepository } from "../../../repositories/IPostRepository";

export interface UpdatePostData {
  title?: string
  body?: string
  excerpt?: string
  categories?: Category[]
  ogImageUrl?: string
}

export class UpdatePost {
  constructor(
    private postRepository: IPostRepository
  ) {}

  async execute(id: string, data: UpdatePostData): Promise<Post> {
    const origialPostData = await this.postRepository.findById(id)
    if (!origialPostData) throw Error(`Post with id ${id} not found`)
    const post = new Post(origialPostData)
    for (const prop of Object.keys(data)) {
      post[prop] = data[prop]
    }
    this.postRepository.update(id, post)
    return post
  }
}