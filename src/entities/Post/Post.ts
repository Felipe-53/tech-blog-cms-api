import { Author } from "../Author/Author"
import { Category } from "../Category/Category"

export function PostFactory(props: {
  uuid: () => string,
  slug: (title: string) => string
}) {

  const { uuid, slug } = props

  class Post {
    readonly id: string
    author: Author
    title: string
    body: string
    excerpt: string
    categories: Category[]
    slug: string
    ogImageUrl: string
    createdAt: Date
    updatedAt: Date
  
    constructor(props: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) {
      Object.assign(this, props)
      if (!this.id) this.id = uuid()
      if (!this.createdAt) this.createdAt = new Date()
      if (!this.updatedAt) this.updatedAt = new Date()
      if (!this.slug) this.slug = slug(this.title)
    }
  }

  return Post
}
