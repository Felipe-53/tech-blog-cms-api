import { expect, test } from "vitest"
import env from "../../env"
import { buildServer } from "../../server"

test("Should NOT be able to get response from /healthcheck without credentials", async () => {
  const server = buildServer()

  const response = await server.inject({
    path: "/healthcheck",
    method: "GET",
  })
  expect(response.statusCode).toBe(401)

  await server.close()
})

test("Should be able to get response from /healthcheck with correct credentials", async () => {
  const server = buildServer()

  const response = await server.inject({
    path: "/healthcheck",
    method: "GET",
    headers: {
      "X-Secret-Key": env.secret_key,
    },
  })
  expect(response.statusCode).toBe(200)
  expect(response.json()).toStrictEqual({ ok: true })

  await server.close()
})
