import { CreateAuthorDTO } from "../../../dtos/CreateAuthorDTO"
import { IAuthorRepository } from "../../../repositories/IAuthorRepository"
import { IHashService } from "../../interfaces/IHashService"

export class CreateAuthor {
  constructor(
    private authorRepository: IAuthorRepository,
    private hashService: IHashService
  ) {}

  async execute(data: CreateAuthorDTO) {
    const { admin, email, name, password } = data
    const passwordHash = await this.hashService.hash(password)

    const author = await this.authorRepository.create({
      admin,
      email,
      name,
      passwordHash,
    })

    return author
  }
}
