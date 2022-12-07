import { config } from "dotenv"

const result = config()

if (!result.parsed) {
  throw Error("Unable to locate .env file")
}

const env = {
  database_url: process.env.DATABASE_URL as string,
  secret_key: process.env.SECRET_KEY as string,
  node_env: process.env.NODE_ENV! as string,
}

export default env
