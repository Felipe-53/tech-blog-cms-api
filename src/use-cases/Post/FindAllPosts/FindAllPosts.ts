import { IPostRepository } from "../../../repositories/IPostRepository";

export class FindAllPosts {
  constructor(
    private postRepository: IPostRepository
  ) {}

  async execute(authorId: string) {
    const posts = await this.postRepository.findAllByAuthorId(authorId)
    return posts
  }
}