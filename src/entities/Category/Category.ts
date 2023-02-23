export function CategoryFactory(props: { uuid: () => string }) {
  const { uuid } = props

  class Category {
    readonly id: string

    constructor(public name: string, public note: boolean, id?: string) {
      this.id = id || uuid()
    }
  }

  return Category
}
