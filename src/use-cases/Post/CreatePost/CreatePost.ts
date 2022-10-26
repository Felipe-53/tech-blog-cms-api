import { CreatePostDTO } from "../../../dtos/CreatePostDTO";
import { Post } from "../../../entities/Post";
import { IPostRepository } from "../../../repositories/IPostRepository";

export class CreatePost {
  constructor(
    private postRepository: IPostRepository
  ) {}

  async execute(data: CreatePostDTO) {
    const post = new Post(data)
    await this.postRepository.create(post)
    return post
  }
}