import "dotenv/config"
import { defineConfig } from "prisma/config"

const databaseUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()

if (!databaseUrl) {
  throw new Error("Set DIRECT_URL or DATABASE_URL before running Prisma CLI commands.")
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
})
