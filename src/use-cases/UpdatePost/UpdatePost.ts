import { IPostRepository, UpdatePostData } from "../../repositories/IPostRepository";

export class UpdatePost {
  constructor(
    private postRepository: IPostRepository
  ) {}

  async execute(id: string, data: UpdatePostData) {
    const post = await this.postRepository.update(id, data)
    return post
  }
}