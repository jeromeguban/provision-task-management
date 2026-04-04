import { PrismaPg } from '@prisma/adapter-pg'
import PrismaClient from '@/generated/prisma/client'
import { getDatabaseUrl } from '@/lib/server-env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: getDatabaseUrl(),
  })

  return new PrismaClient({
    adapter,
  })
}

export function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const client = createPrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = client[prop as keyof PrismaClient]

    return typeof value === 'function' ? value.bind(client) : value
  },
})
