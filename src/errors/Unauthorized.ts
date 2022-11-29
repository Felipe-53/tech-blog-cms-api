import { HTTPError } from "./HTTPError"

export class Unauthorized extends HTTPError {
  constructor(message: string) {
    super({
      code: 401,
      message,
    })
  }
}
