import { describe, expect, it } from "vitest"
import { InMemoryCategoryRespository } from "../repositories/implentations/InMemory/InMemoryCategoryRepository"
import { CreateCategory } from "../use-cases/Category/CreateCategory/CreateCategory"
import { DeleteCategory } from "../use-cases/Category/DeleteCategory/DeleteCategory"
import { FindAllCategories } from "../use-cases/Category/FindAllCategories/FindAllCategories"

describe("categories", () => {
  const inMemoryCatRepo = new InMemoryCategoryRespository()

  it("Should be able to create a category", async () => {
    const createCategory = new CreateCategory(inMemoryCatRepo)
    const cat = await createCategory.execute({ name: "node", note: false })
    expect(cat).toBeDefined()
  })

  it("Should be able to find created category", async () => {
    const findAllCats = new FindAllCategories(inMemoryCatRepo)
    const cats = await findAllCats.execute()
    expect(cats.length).toBe(1)
    const cat = cats[0]
    expect(cat.name).toBe("node")
    expect(cat.note).toBe(false)
  })

  it("Should be able to delete created category", async () => {
    const deleteCat = new DeleteCategory(inMemoryCatRepo)
    const findAllCats = new FindAllCategories(inMemoryCatRepo)
    const cat = (await findAllCats.execute())[0]
    await deleteCat.execute(cat.id)
    const cats = await findAllCats.execute()
    expect(cats.length).toBe(0)
  })
})
