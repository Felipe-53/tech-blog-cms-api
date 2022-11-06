import { Author } from '../entities/Author/'
export interface IAuthorRepository {
  create: (author: Omit<Author, 'id'>) => Promise<Author>
  findById: (id: string) => Promise<Author | null>
}
