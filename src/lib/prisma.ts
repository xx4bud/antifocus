import { PrismaClient, Prisma } from "@prisma/client";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import superjson from "superjson";
import ws from "ws";
import { Decimal } from "@prisma/client/runtime/library";


neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const prismaClientSingleton = () => {
  const neon = new Pool({
    connectionString: process.env.POSTGRES_PRISMA_URL!,
  });
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma =
  globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export { prisma, superjson };
