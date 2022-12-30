import { PgCategoryRespository } from "../../repositories/implentations/postgres/PgCategoryRepository"
import { FindAllCategories } from "../../use-cases/Category/FindAllCategories/FindAllCategories"

async function getCategoryHandler() {
  const categoryRepo = new PgCategoryRespository()

  const findAllCategories = new FindAllCategories(categoryRepo)

  const cats = await findAllCategories.execute()

  return cats
}

export { getCategoryHandler }
