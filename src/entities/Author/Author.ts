export function AuthorFactory({ uuid }: {uuid: () => string}) {
    class Author {
      readonly id: string
      
      constructor(
        public name: string,
        public admin: boolean,
        id?: string
      ) {
        if (!id) {
          this.id = uuid()
        }
      }
    }

    return Author
  }
