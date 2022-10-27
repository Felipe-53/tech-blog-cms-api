import { Author } from "../Author/Author"
import { Category } from "../Category"

export function PostFactory(props: {
  uuid: () => string,
  slug: (title: string) => string
}) {

  const { uuid, slug } = props

  class Post {
    readonly id: string
    private _title: string
    private _body: string
    author: Author
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

    private updatePostDate() {
      this.updatedAt = new Date()
    }

    private updateSlug(newTitle: string) {
      this.slug = slug(newTitle)
    }

    set body(body: string) {
      this._body = body
      this.updatePostDate()
    }

    get body() {
      return this._body
    }

    set title(title: string) {
      this._title = title
      this.updateSlug(title)
    }

    get title() {
      return this._title
    }
  }

  return Post
}
