import { Category } from "../../../entities/Category/"
import { ICategoryRepository } from "../../../repositories/ICategoryRepository"
import { prisma } from "./index"

export class PgCategoryRespository implements ICategoryRepository {
  async create(category: Category) {
    await prisma.dBCategory.create({
      data: {
        id: category.id,
        name: category.name,
        note: category.note,
      },
    })
    return category
  }

  async findAll() {
    const cats = await prisma.dBCategory.findMany()
    return cats.map((cat) => new Category(cat.name, cat.note, cat.id))
  }

  async findById(id: string) {
    const cat = await prisma.dBCategory.findUnique({
      where: {
        id,
      },
    })
    if (!cat) return null

    return new Category(cat.name, cat.note, cat.id)
  }

  async delete(id: string) {
    await prisma.dBCategory.delete({
      where: {
        id,
      },
    })
  }
}
