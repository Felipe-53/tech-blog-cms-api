import { IPostRepository } from "../../../repositories/IPostRepository"

export class FindPostBySlug {
  constructor(private postRepository: IPostRepository) {}

  async execute(slug: string) {
    const post = await this.postRepository.findBySlug(slug)
    return post
  }
}
