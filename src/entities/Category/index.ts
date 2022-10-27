import { randomUUID } from 'crypto'
import { CategoryFactory } from './Category'

const ConcreteCategory = CategoryFactory({uuid: randomUUID})

export class Category extends ConcreteCategory {}
