import { Type } from "@sinclair/typebox"

const UnauthorizedResponse = Type.Object({
  code: Type.Number({ default: 401 }),
  massage: Type.String({ default: "Unauthorized" }),
})

const BadRequestResponse = Type.Object({
  code: Type.Number({ default: 400 }),
  massage: Type.String({ default: "Bad Request" }),
})

const simpleAuthHeaderSchema = Type.Object({
  "x-secret-key": Type.String(),
})

export { UnauthorizedResponse, BadRequestResponse, simpleAuthHeaderSchema }
