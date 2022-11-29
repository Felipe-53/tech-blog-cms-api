import { HTTPError } from "./HTTPError"

export class BadRequest extends HTTPError {
  constructor(message: string) {
    super({
      code: 400,
      message,
    })
  }
}
