export interface IHashService {
  hash: (password: string) => Promise<string>
  compare: (passwordHash: string, password: string) => Promise<Boolean>
}
