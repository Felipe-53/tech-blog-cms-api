import { FastifyRequest } from "fastify"
import { Type, Static } from "@sinclair/typebox"
import { PgCategoryRespository } from "../../repositories/implentations/postgres/PgCategoryRepository"
import { CreateCategory } from "../../use-cases/Category/CreateCategory/CreateCategory"

const createCategoryData = Type.Object({
  name: Type.String(),
})

type CreateCategoryDataType = Static<typeof createCategoryData>

async function createCategoryHandler(
  req: FastifyRequest<{ Body: CreateCategoryDataType }>
) {
  const categoryRepo = new PgCategoryRespository()

  const createCategory = new CreateCategory(categoryRepo)

  const { name } = req.body

  const cat = await createCategory.execute({
    name,
  })

  return cat
}

export { createCategoryHandler, createCategoryData }
