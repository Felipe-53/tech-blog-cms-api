import { randomUUID } from 'crypto'
import { AuthorFactory } from './Author'

const ConcreteAuthor = AuthorFactory({uuid: randomUUID})

export class Author extends ConcreteAuthor {}
