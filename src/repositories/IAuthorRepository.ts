import { Author } from "../entities/Author/"

export interface CreateAuthorData {
  name: string
  email: string
  password: string
  admin: boolean
}

export interface IAuthorRepository {
  create: (author: CreateAuthorData) => Promise<Author>
  findById: (id: string) => Promise<Author | null>
  delete: (id: string) => Promise<void>
}
