import { neonConfig, Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

import ws from "ws"
neonConfig.webSocketConstructor = ws

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

const prismaClientSingleton = () => {
  const neon = new Pool({
    connectionString: process.env.POSTGRES_PRISMA_URL!,
  })
  const adapter = new PrismaNeon(neon)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal:
    | undefined
    | ReturnType<typeof prismaClientSingleton>
}

const prisma =
  globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prisma

export { prisma }
