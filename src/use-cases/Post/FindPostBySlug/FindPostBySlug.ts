import { IPostRepository } from "../../../repositories/IPostRepository"

export class FindPostBySlug {
  constructor(private postRepository: IPostRepository) {}

  async execute(slug: string, note: boolean) {
    const post = await this.postRepository.findBySlug(slug, note)
    return post
  }
}
