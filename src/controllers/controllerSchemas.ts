import { Type } from "@sinclair/typebox"

const simpleAuthHeaderSchema = Type.Object({
  "x-secret-key": Type.String(),
})

const authRoutesBaseHeadersSchema = Type.Object({
  authorization: Type.String(),
})

export { authRoutesBaseHeadersSchema, simpleAuthHeaderSchema }
