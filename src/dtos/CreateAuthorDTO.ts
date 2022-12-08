import { Author } from "../entities/Author"

export type CreateAuthorDTO = Omit<Author, "id"> & {
  password: string
}
