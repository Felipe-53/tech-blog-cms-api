import { Type as T, Static } from "@sinclair/typebox"
import { serializedAuthorDataSchema } from "./authorSchema"
import { serializedCategoryArrayDataSchema } from "./categorySchema"

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
  note: T.Boolean(),
})

const serializedPostDataSchema = T.Object({
  id: T.String(),
  title: T.String(),
  body: T.String(),
  author: serializedAuthorDataSchema,
  excerpt: T.String(),
  categories: serializedCategoryArrayDataSchema,
  slug: T.String(),
  ogImageUrl: T.String(),
  createdAt: T.String(),
  updatedAt: T.Union([T.String(), T.Null()]),
  note: T.Boolean(),
})

type InputPostData = Static<typeof inputPostDataSchema>

export { inputPostDataSchema, InputPostData, serializedPostDataSchema }
