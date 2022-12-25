import { FastifyReply, FastifyRequest } from "fastify"
import env from "../env"
import { TriggerNewVercelDeployment } from "../use-cases/Vercel/TriggerNewVercelDeployment"

export async function vercelIntegrationHook(
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (env.node_env !== "production") return
  if (!(reply.statusCode === 200 || reply.statusCode === 201)) return

  const triggerDeployment = new TriggerNewVercelDeployment()
  const response = await triggerDeployment.execute()
  if (!response.ok) {
    req.log.error("Unable to request vercel deployment")
    req.log.error(await response.json())
  }
  req.log.info("Successful vercel deployment")
  req.log.info(await response.json())
}
