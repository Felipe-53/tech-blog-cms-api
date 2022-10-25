import { randomUUID } from "crypto";
import { PostFactory } from "./Post";
import slugify from 'slugify'

const ConcretePost = PostFactory({
  uuid: randomUUID,
  slug: (string: string) => slugify(string, { lower: true })
})

export class Post extends ConcretePost {}
