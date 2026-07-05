import { prisma } from '../helpers/dbConnection.js'
import { createDynamicFieldsSchema } from '../schemas/dynamicTicketFieldsSchema.js'
import { getAuthenticatedUserContext } from './authContextModel.js'

const ticketInclude = {
  category: true,
  school: { select: { id: true, name: true, address: true } },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      registration: true,
      role: true,
      schoolId: true,
      createdAt: true,
      updatedAt: true
    }
  }
}

function requireSchool(user) {
  if (!user.schoolId) throw new Error('Usuário não está vinculado a nenhuma escola.')
  return user.schoolId
}

function requireManager(user) {
  if (user.role !== 'MANAGER') {
    throw new Error('Você não tem permissão para acessar este recurso.')
  }
}

export async function getAuthenticatedUserSchool(userId) {
  const user = await getAuthenticatedUserContext(userId)
  requireSchool(user)
  return user
}

export async function createTicket(data, userId) {
  const user = await getAuthenticatedUserContext(userId)
  if (user.role !== 'SCHOOL_USER') {
    throw new Error('Você não tem permissão para acessar este recurso.')
  }
  const schoolId = requireSchool(user)

  const category = await prisma.ticketCategory.findUnique({
    where: { id: data.categoryId },
    include: { fields: { orderBy: [{ order: 'asc' }, { id: 'asc' }] } }
  })

  if (!category || !category.active) throw new Error('Categoria inválida.')

  const dynamicFields = createDynamicFieldsSchema(category.fields).parse(data.dynamicFields)

  return prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      categoryId: data.categoryId,
      dynamicFields,
      schoolId,
      createdById: user.id
    },
    include: ticketInclude
  })
}

export async function listTickets(userId, query) {
  const user = await getAuthenticatedUserContext(userId)
  const where = {}

  if (user.role === 'SCHOOL_USER') {
    where.schoolId = requireSchool(user)
  } else if (user.role === 'MANAGER' && query.schoolId) {
    where.schoolId = query.schoolId
  }

  if (query.status) where.status = query.status
  if (query.priority) where.priority = query.priority
  if (query.categoryId) where.categoryId = query.categoryId
  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } }
    ]
  }

  const skip = (query.page - 1) * query.limit
  const [tickets, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      include: ticketInclude
    }),
    prisma.ticket.count({ where })
  ])

  return {
    tickets,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  }
}

export async function getTicketById(id, userId) {
  const user = await getAuthenticatedUserContext(userId)
  const where = { id }
  if (user.role === 'SCHOOL_USER') where.schoolId = requireSchool(user)

  const ticket = await prisma.ticket.findFirst({ where, include: ticketInclude })
  if (!ticket) throw new Error('Chamado não encontrado.')
  return ticket
}

export async function updateTicketStatus(id, data, userId) {
  const user = await getAuthenticatedUserContext(userId)
  requireManager(user)

  const existing = await prisma.ticket.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw new Error('Chamado não encontrado.')

  return prisma.ticket.update({
    where: { id },
    data: { status: data.status },
    include: ticketInclude
  })
}

export async function updateTicketEstimate(id, data, userId) {
  const user = await getAuthenticatedUserContext(userId)
  requireManager(user)

  const existing = await prisma.ticket.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw new Error('Chamado não encontrado.')

  return prisma.ticket.update({
    where: { id },
    data: { estimatedAt: new Date(data.estimatedAt) },
    include: ticketInclude
  })
}
