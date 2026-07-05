import "dotenv/config"
import bcrypt from "bcrypt"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client.ts"

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10)

  let school = await prisma.school.findFirst({
    where: {
      name: "EMEF Escola Teste",
    },
  })

  if (!school) {
    school = await prisma.school.create({
      data: {
        name: "EMEF Escola Teste",
        address: "Endereço de teste",
      },
    })
  }

  await prisma.user.upsert({
    where: {
      email: "escola@teste.com",
    },
    update: {
      name: "Usuário Escola",
      registration: "12345",
      pass: passwordHash,
      role: "SCHOOL_USER",
      schoolId: school.id,
    },
    create: {
      name: "Usuário Escola",
      email: "escola@teste.com",
      registration: "12345",
      pass: passwordHash,
      role: "SCHOOL_USER",
      schoolId: school.id,
    },
  })

  await prisma.user.upsert({
    where: {
      email: "seduc@teste.com",
    },
    update: {
      name: "Teste Seduc",
      registration: "54321",
      pass: passwordHash,
      role: "MANAGER",
      schoolId: null,
    },
    create: {
      name: "Teste Seduc",
      email: "seduc@teste.com",
      registration: "54321",
      pass: passwordHash,
      role: "MANAGER",
      schoolId: null,
    },
  })

  console.log("Seed executado com sucesso!")
  console.log("Usuário escola: Matricula: 12345 / Senha: 123456")
  console.log("Manager: Matricula: 54321 / Senha: 123456")
}

main()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })