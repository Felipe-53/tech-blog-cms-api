export function CategoryFactory (props: {
  uuid: () => string
}) {
  const { uuid } = props

  class Category {
    readonly id: string

    constructor(
      public name: string,
      id?: string
    ) {
      if (!id) this.id = uuid()
    }
  }

  return Category
}
