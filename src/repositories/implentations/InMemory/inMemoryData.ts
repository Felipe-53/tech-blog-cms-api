import { Author } from "../../../entities/Author"
import { Category } from "../../../entities/Category/"
import { Post } from "../../../entities/Post"

interface InMemoryData {
  posts: Post[]
  categories: Category[]
  authors: Author[]
}

const data: InMemoryData = {
  posts: [],
  categories: [],
  authors: []
}

export default data
