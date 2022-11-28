import { MakeOptional } from "../../types/MakeOptinal"
import { Author } from "../Author"
import { Category } from "../Category"

export function PostFactory(props: {
  uuid: () => string
  slug: (title: string) => string
}) {
  const { uuid, slug } = props

  class Post {
    readonly id: string
    private _title!: string
    private _body!: string
    author: Author
    excerpt: string
    categories: Category[]
    slug: string
    ogImageUrl: string
    createdAt: Date
    updatedAt: Date | null

    constructor(
      props: MakeOptional<Post, "id" | "createdAt" | "updatedAt" | "slug">
    ) {
      this.id = props.id || uuid()
      this.body = props.body
      this.author = props.author
      this.excerpt = props.excerpt
      this.categories = props.categories
      this.ogImageUrl = props.ogImageUrl
      this.title = props.title
      this.createdAt = props.createdAt || new Date()
      this.updatedAt = props.updatedAt || null
      this.slug = props.slug || slug(props.title)
    }

    set body(body: string) {
      this._body = body
      this.updatedAt = new Date()
    }

    get body() {
      return this._body
    }

    set title(title: string) {
      this._title = title
      this.slug = slug(title)
    }

    get title() {
      return this._title
    }
  }

  return Post
}
