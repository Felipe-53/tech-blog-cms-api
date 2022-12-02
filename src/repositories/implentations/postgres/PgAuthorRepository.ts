import { Author } from "../../../entities/Author"
import { CreateAuthorData, IAuthorRepository } from "../../IAuthorRepository"
import { prisma } from "../postgres"
import bcrypt from "bcrypt"
export class PgAuthorRepository implements IAuthorRepository {
  async create(authorData: CreateAuthorData) {
    const author = new Author(
      authorData.name,
      authorData.email,
      authorData.admin
    )

    await prisma.dBAuthor.create({
      data: {
        id: author.id,
        name: author.name,
        admin: author.admin,
        email: author.email,
        passwordHash: await bcrypt.hash(authorData.password, 10),
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
    return new Author(author.name, author.email, author.admin, author.id)
  }

  async delete(id: string) {
    await prisma.dBAuthor.delete({
      where: {
        id,
      },
    })
  }
}
