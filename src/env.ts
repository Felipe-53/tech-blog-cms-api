import { config } from "dotenv"

const result = config()

const env = {
  database_url: process.env.DATABASE_URL as string,
  secret_key: process.env.SECRET_KEY as string,
  node_env: process.env.NODE_ENV as string,
  vercel_api_url: process.env.VERCEL_API_URL as string,
  vercel_api_token: process.env.VERCEL_API_TOKEN as string,
  aws_sqs_queue_url: process.env.AWS_SQS_QUEUE_URL as string,
}

assertDefinedKeys(env)

function assertDefinedKeys(env: { [key: string]: string }) {
  for (const key of Object.keys(env)) {
    if (!env[key]) {
      throw Error(`Expected environment varibale ${key} to be defined`)
    }
  }
}

export default env
