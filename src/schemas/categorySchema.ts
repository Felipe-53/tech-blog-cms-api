import { Type as T, Static } from "@sinclair/typebox"

const serializedCategoryDataSchema = T.Object({
  id: T.String(),
  name: T.String(),
  note: T.Boolean(),
})

const serializedCategoryArrayDataSchema = T.Array(serializedCategoryDataSchema)

const inputCategoryDataSchema = T.Omit(serializedCategoryDataSchema, ["id"])

type InputCategoryDataSchema = Static<typeof inputCategoryDataSchema>

const querystringCategoryDataSchema = T.Object({
  note: T.Boolean(),
})

type QuerystringCategoryDataSchema = Static<
  typeof querystringCategoryDataSchema
>

export {
  serializedCategoryDataSchema,
  inputCategoryDataSchema,
  InputCategoryDataSchema,
  serializedCategoryArrayDataSchema,
  querystringCategoryDataSchema,
  QuerystringCategoryDataSchema,
}
