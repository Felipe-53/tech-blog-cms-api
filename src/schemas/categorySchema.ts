import { Type as T, Static } from "@sinclair/typebox"

const serializedCategoryDataSchema = T.Object({
  id: T.String(),
  name: T.String(),
})

const inputCategoryDataSchema = T.Omit(serializedCategoryDataSchema, ["id"])

type InputAuthorData = Static<typeof inputCategoryDataSchema>

export { serializedCategoryDataSchema, inputCategoryDataSchema }
