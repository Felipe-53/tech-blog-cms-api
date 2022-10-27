import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class FindAllCategories {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {}

  async execute() {
    const cats = await this.categoryRepository.findAll()
    return cats
  }
}