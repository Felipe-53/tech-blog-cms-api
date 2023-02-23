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
    note: boolean

    constructor(
      props: MakeOptional<
        Post,
        "id" | "createdAt" | "updatedAt" | "slug" | "toJSON"
      >
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
      this.note = props.note
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

    toJSON() {
      return {
        id: this.id,
        title: this._title,
        body: this._body,
        author: this.author,
        excerpt: this.excerpt,
        categories: this.categories,
        slug: this.slug,
        ogImageUrl: this.ogImageUrl,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        note: this.note,
      }
    }
  }

  return Post
}
