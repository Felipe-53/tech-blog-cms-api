import { DBAuthor } from "@prisma/client"
import { Author } from "../../../entities/Author"
import { IAuthorRepository } from "../../IAuthorRepository"
import data from "./inMemoryData"

export class InMemoryAuthorRepository implements IAuthorRepository {
  async create(authorData: Omit<Author, "id">) {
    const author = new Author(
      authorData.name,
      authorData.email,
      authorData.admin
    )
    data.authors.push(author)
    return author
  }

  async findById(id: string) {
    const author = data.authors.find((author) => author.id === id)
    if (!author) return null
    return author
  }

  async findByEmail(email: string) {
    const author = data.authors.find((author) => author.email === email)
    if (!author) return null
    return author as DBAuthor // TODO: fix this
  }

  async delete(id: string) {
    data.authors = data.authors.filter((author) => {
      return author.id !== id
    })
  }
}
