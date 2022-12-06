import { HTTPError } from "./HTTPError"

export class Unauthorized extends HTTPError {
  constructor(message?: string) {
    if (!message) {
      message = "Unauthorized"
    }

    super({
      code: 401,
      message,
    })
  }
}
