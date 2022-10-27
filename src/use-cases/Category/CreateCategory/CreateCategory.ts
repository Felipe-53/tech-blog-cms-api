import { Category } from "../../../entities/Category/";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class CreateCategory {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {}

  async execute({ name }: { name: string }) {
    const cat = new Category(name)
    await this.categoryRepository.create(cat)
    return cat
  }
}