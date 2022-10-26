import { IPostRepository } from "../../repositories/IPostRepository";

export class DeletePost {
  constructor(
    private postRepository: IPostRepository
  ) {}

  async execute(postId: string) {
    await this.postRepository.delete(postId)
  }
}
