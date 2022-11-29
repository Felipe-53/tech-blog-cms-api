export class HTTPError extends Error {
  code: number
  message: string

  constructor({ code, message }: { code: number; message: string }) {
    super()
    this.code = code
    this.message = message
  }
}
