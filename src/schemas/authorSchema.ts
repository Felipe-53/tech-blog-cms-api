import { Type as T, Static } from "@sinclair/typebox"

const serializedAuthorDataSchema = T.Object({
  id: T.String(),
  name: T.String(),
  email: T.String(),
  admin: T.Boolean(),
})

const inputAuthorDataSchema = T.Intersect([
  T.Omit(serializedAuthorDataSchema, ["id"]),
  T.Object({ password: T.String() }),
])

const loginDataSchema = T.Object({
  email: T.String(),
  password: T.String(),
})

type LoginData = Static<typeof loginDataSchema>

type InputAuthorData = Static<typeof inputAuthorDataSchema>

const loginResponseSchema = T.Object({
  token: T.String(),
})

export {
  serializedAuthorDataSchema,
  inputAuthorDataSchema,
  InputAuthorData,
  loginDataSchema,
  LoginData,
  loginResponseSchema,
}
