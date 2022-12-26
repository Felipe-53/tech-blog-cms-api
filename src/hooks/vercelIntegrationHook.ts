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

  triggerDeployment
    .execute()
    .then((response) => {
      if (!response.ok) {
        req.log.error("Unable to trigger vercel deployment")
        response.json().then((body) => req.log.error(body))
        return
      }
      req.log.info("Successful vercel deployment")
      response.json().then((body) => req.log.info(body))
    })
    .catch((err) => req.log.error(err))
}
