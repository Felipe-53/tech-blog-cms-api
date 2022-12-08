import { DBAuthor } from "@prisma/client"
import { Author } from "../entities/Author/"

export interface CreateAuthorData {
  name: string
  email: string
  passwordHash: string
  admin: boolean
}

export interface IAuthorRepository {
  create: (author: CreateAuthorData) => Promise<Author>
  findById: (id: string) => Promise<Author | null>
  // TODO: DBAuthor here is a quick-fix
  findByEmail: (email: string) => Promise<DBAuthor | null>
  delete: (id: string) => Promise<void>
}
