import env from "../../env"

const vercelData = {
  name: "tech-blog",
  target: "production",
  gitSource: {
    type: "github",
    repoId: 433515552,
    ref: "main",
  },
} as const

const deploymentsEndpoint = "v13/deployments"

export class TriggerNewVercelDeployment {
  async execute() {
    if (env.node_env !== "production") {
      throw new Error("Production only feature")
    }

    const baseUrl = env.vercel_api_url
    const fetchUrl = new URL(`${baseUrl}/${deploymentsEndpoint}`)
    fetchUrl.searchParams.append("forceNew", "1")

    const token = env.vercel_api_token

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vercelData),
    })

    return response
  }
}
