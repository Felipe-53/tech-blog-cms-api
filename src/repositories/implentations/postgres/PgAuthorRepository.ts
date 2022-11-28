import { Author } from "../../../entities/Author"
import { IAuthorRepository } from "../../IAuthorRepository"
import { prisma } from "../postgres"

export class PgAuthorRepository implements IAuthorRepository {
  async create(authorData: Omit<Author, "id">) {
    const author = new Author(authorData.name, authorData.admin)
    await prisma.dBAuthor.create({
      data: {
        id: author.id,
        name: author.name,
        admin: author.admin,
      },
    })
    return author
  }

  async findById(id: string) {
    const author = await prisma.dBAuthor.findUnique({
      where: {
        id,
      },
    })
    if (!author) return null
    return new Author(author.name, author.admin, author.id)
  }
}
