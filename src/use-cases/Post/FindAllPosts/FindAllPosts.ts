import { IPostRepository } from "../../../repositories/IPostRepository"

export class FindAllPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(authorId: string, note: boolean) {
    const posts = await this.postRepository.findAllByAuthorId(authorId, note)
    return posts
  }
}
