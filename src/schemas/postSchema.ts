import { Type as T, Static } from "@sinclair/typebox"
import { serializedAuthorDataSchema } from "./authorSchema"
import { serializedCategoryDataSchema } from "./categorySchema"

const inputPostDataSchema = T.Object({
  body: T.String(),
  title: T.String(),
  excerpt: T.String(),
  categories: T.Array(
    T.Object({
      id: T.String(),
      name: T.String(),
    })
  ),
  ogImageUrl: T.String(),
})

const serializedPostDataSchema = T.Object({
  id: T.String(),
  title: T.String(),
  body: T.String(),
  author: serializedAuthorDataSchema,
  excerpt: T.String(),
  categories: serializedCategoryDataSchema,
  slug: T.String(),
  ogImageUrl: T.String(),
  createdAt: T.Date(),
  updatedAt: T.Date(),
})

type InputPostData = Static<typeof inputPostDataSchema>

export { inputPostDataSchema, InputPostData, serializedPostDataSchema }
