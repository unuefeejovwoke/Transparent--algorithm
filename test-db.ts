import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log("Connected to Supabase Postgres")
  } catch (err) {
    console.error("Connection failed")
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
