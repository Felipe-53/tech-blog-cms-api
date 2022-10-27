import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class DeleteCategory {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(id: string) {
    await this.categoryRepository.delete(id)
  }
}
