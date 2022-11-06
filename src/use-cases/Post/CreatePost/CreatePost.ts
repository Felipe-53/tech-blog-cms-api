import { CreatePostDTO } from "../../../dtos/CreatePostDTO";
import { Post } from "../../../entities/Post";
import { IAuthorRepository } from "../../../repositories/IAuthorRepository";
import { IPostRepository } from "../../../repositories/IPostRepository";

export class CreatePost {
  constructor(
    private postRepository: IPostRepository,
    private authorRepository: IAuthorRepository
  ) {}

  async execute(data: CreatePostDTO) {
    const authorId = data.author.id as string
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw Error(`No such author with id ${authorId}`)
    const post = new Post(data)
    await this.postRepository.create(post)
    return post
  }
}