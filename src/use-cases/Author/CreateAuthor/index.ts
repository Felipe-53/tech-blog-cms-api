import { makeCreateAuthor } from "./CreateAuthor"
import bcrypt from "bcrypt"

const ConcreteCreateAuthor = makeCreateAuthor({
  hash: (password: string) => bcrypt.hash(password, 10),
  compare: bcrypt.compare,
})

export class CreateAuthor extends ConcreteCreateAuthor {}
