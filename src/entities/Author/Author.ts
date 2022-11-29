export function AuthorFactory({ uuid }: { uuid: () => string }) {
  class Author {
    readonly id: string

    constructor(
      public name: string,
      public email: string,
      public admin: boolean,
      id?: string
    ) {
      this.id = id || uuid()
    }
  }

  return Author
}
