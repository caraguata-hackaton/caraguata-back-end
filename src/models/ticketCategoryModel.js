import { prisma } from '../helpers/dbConnection.js'

export function listTicketCategories() {
  return prisma.ticketCategory.findMany({
    where: { active: true },
    select: { id: true, name: true, description: true, active: true },
    orderBy: { name: 'asc' }
  })
}

export async function getTicketCategoryFields(id) {
  const category = await prisma.ticketCategory.findFirst({
    where: { id, active: true },
    select: {
      id: true,
      name: true,
      fields: {
        select: {
          id: true,
          name: true,
          label: true,
          type: true,
          required: true,
          placeholder: true,
          order: true,
          options: true
        },
        orderBy: [{ order: 'asc' }, { id: 'asc' }]
      }
    }
  })

  if (!category) throw new Error('Categoria inválida.')
  return category
}

export function createTicketCategory(data) {
  return prisma.ticketCategory.create({ data })
}

export async function createTicketField(data) {
  const category = await prisma.ticketCategory.findUnique({ where: { id: data.categoryId } })
  if (!category) throw new Error('Categoria inválida.')
  return prisma.ticketField.create({ data })
}
