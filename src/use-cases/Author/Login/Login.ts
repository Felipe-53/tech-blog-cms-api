import { IAuthorRepository } from "../../../repositories/IAuthorRepository"
import { IHashService } from "../../interfaces/IHashService"

type LoginData = {
  email: string
  password: string
}

export class Login {
  constructor(
    private authorRepository: IAuthorRepository,
    private hashService: IHashService
  ) {}

  async execute(data: LoginData) {
    const { email, password } = data

    const author = await this.authorRepository.findByEmail(email)

    if (!author) throw new Error("Invalid credentials")

    const match = await this.hashService.compare(password, author.passwordHash)
    if (!match) throw new Error("Invalid credentials")

    return author
  }
}
