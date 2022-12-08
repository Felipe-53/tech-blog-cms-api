import { CreateAuthorDTO } from "../../../dtos/CreateAuthorDTO"
import { IAuthorRepository } from "../../../repositories/IAuthorRepository"
import { IHashService } from "../../interfaces/IHashService"

export function makeCreateAuthor(hashService: IHashService) {
  class CreateAuthor {
    constructor(private authorRepository: IAuthorRepository) {}

    async execute(data: CreateAuthorDTO) {
      const { admin, email, name, password } = data
      const passwordHash = await hashService.hash(password)

      const author = await this.authorRepository.create({
        admin,
        email,
        name,
        passwordHash,
      })

      return author
    }
  }

  return CreateAuthor
}
