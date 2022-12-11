import { config } from "dotenv"

const result = config()

const env = {
  database_url: process.env.DATABASE_URL as string,
  secret_key: process.env.SECRET_KEY as string,
  node_env: process.env.NODE_ENV! as string,
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
