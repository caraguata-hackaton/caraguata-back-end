import bcrypt from "bcrypt"
import { PrismaClient } from "../generated/prisma/client.ts"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 10)

  const school = await prisma.school.upsert({
    where: {
      name: "EMEF Escola Teste",
    },
    update: {},
    create: {
      name: "EMEF Escola Teste",
      address: "Endereço de teste",
    },
  })

  await prisma.user.upsert({
    where: {
      email: "escola@teste.com",
    },
    update: {
      name: "Teste Escola",
      registration: "123456",
      password: passwordHash,
      role: "SCHOOL_USER",
      schoolId: school.id,
    },
    create: {
      name: "Teste Escola",
      email: "escola@teste.com",
      registration: "12345",
      password: passwordHash,
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
      password: passwordHash,
      role: "MANAGER",
      schoolId: null,
    },
    create: {
      name: "Teste Seduc",
      email: "seduc@teste.com",
      registration: "54321",
      password: passwordHash,
      role: "MANAGER",
      schoolId: null,
    },
  })

  console.log("Seed executado com sucesso!")
  console.log("Usuário escola: escola@teste.com / 123456")
  console.log("Manager: manager@teste.com / 123456")
}

main()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })