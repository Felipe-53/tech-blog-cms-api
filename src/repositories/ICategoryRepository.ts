import { Category } from '../entities/Category'
export interface ICategoryRepository {
  create: (category: Category) => Promise<Category>
  findAll: () => Promise<Category[]>   
  findById: (id: string) => Promise<Category | null>
  delete: (id: string) => Promise<void>
}
