import { FastifyRequest } from "fastify"
import { PgCategoryRespository } from "../../repositories/implentations/postgres/PgCategoryRepository"
import { CreateCategory } from "../../use-cases/Category/CreateCategory/CreateCategory"
import { InputCategoryDataSchema } from "../../schemas/categorySchema"

async function createCategoryHandler(
  req: FastifyRequest<{ Body: InputCategoryDataSchema }>
) {
  const categoryRepo = new PgCategoryRespository()

  const createCategory = new CreateCategory(categoryRepo)

  const { name, note } = req.body

  const cat = await createCategory.execute({
    name,
    note,
  })

  return cat
}

export { createCategoryHandler }
