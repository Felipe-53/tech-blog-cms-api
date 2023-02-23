import { Category } from "../../../entities/Category/"
import { ICategoryRepository } from "../../../repositories/ICategoryRepository"
import { InputCategoryDataSchema } from "../../../schemas/categorySchema"

export class CreateCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: InputCategoryDataSchema) {
    const cat = new Category(request.name, request.note)
    await this.categoryRepository.create(cat)
    return cat
  }
}
