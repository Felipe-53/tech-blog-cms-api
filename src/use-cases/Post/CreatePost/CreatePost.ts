import { CreatePostDTO } from "../../../dtos/CreatePostDTO"
import { Category } from "../../../entities/Category"
import { Post } from "../../../entities/Post"
import { IAuthorRepository } from "../../../repositories/IAuthorRepository"
import { ICategoryRepository } from "../../../repositories/ICategoryRepository"
import { IPostRepository } from "../../../repositories/IPostRepository"

export class InconsistentData extends Error {}

export class CreatePost {
  constructor(
    private postRepository: IPostRepository,
    private categoryRepository: ICategoryRepository,
    private authorRepository: IAuthorRepository
  ) {}

  async execute(data: CreatePostDTO) {
    const authorId = data.author.id as string
    const author = await this.authorRepository.findById(authorId)
    if (!author)
      throw new InconsistentData(`No such author with id ${authorId}`)

    const existingCategories = await this.categoryRepository.findAll()
    const existingCategoriesIds = existingCategories.map((cat) => cat.id)
    for (const cat of data.categories) {
      if (!existingCategoriesIds.includes(cat.id)) {
        throw new InconsistentData(
          `Category with id ${cat.id} does not exist in category repository`
        )
      }
    }

    const categories = data.categories.map((cat) => {
      return existingCategories.find((c) => c.id === cat.id)
    }) as Category[]

    const post = new Post({
      ...data,
      categories,
    })

    await this.postRepository.create(post)
    return post
  }
}
