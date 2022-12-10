import awsLambdaFastify from "@fastify/aws-lambda"
import { buildServer } from "./server"

const proxy = awsLambdaFastify(
  buildServer({
    logger: true,
  })
)

export { proxy as handler }
