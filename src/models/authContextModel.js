import { prisma } from '../helpers/dbConnection.js'

export async function getAuthenticatedUserContext(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      registration: true,
      role: true,
      schoolId: true,
      school: {
        select: {
          id: true,
          name: true,
          address: true
        }
      }
    }
  })

  if (!user) throw new Error('Usuário não encontrado.')
  return user
}
