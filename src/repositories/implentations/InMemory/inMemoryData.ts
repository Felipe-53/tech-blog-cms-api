import { Category } from "../../../entities/Category/"
import { Post } from "../../../entities/Post"

interface InMemoryData {
  posts: Post[]
  categories: Category[]
}

const data: InMemoryData = {
  posts: [],
  categories: []
}

export default data
