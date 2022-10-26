import { Category } from '../../../entities/Category/Category'
import { ICategoryRepository } from '../../../repositories/ICategoryRepository';
import data from './inMemoryData'

export class InMemoryCategoryRespository implements ICategoryRepository {

  async create(category: Category) {
    data.categories.push(category)
    return category
  }

  async findAll() {
    return data.categories
  }


  async findById(id: string) {
    const cat = data.categories.find(cat => cat.id === id)
    if (!cat) return null
    return cat
  }

  async delete(id: string) {
    let previousLegth = data.categories.length
    data.categories = data.categories.filter(cat => cat.id !== id)
    let newLength = data.categories.length
    if (previousLegth === newLength) {
      throw Error(`Trying to delete unexisting cat with id ${id}`)
    }
  }
}
