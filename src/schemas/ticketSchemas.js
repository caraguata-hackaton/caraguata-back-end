import { z } from 'zod'

export const ticketStatusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELED'
])

export const ticketPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export const ticketFieldTypeSchema = z.enum([
  'TEXT',
  'TEXTAREA',
  'NUMBER',
  'BOOLEAN',
  'SELECT',
  'DATE'
])

export const createTicketSchema = z.object({
  title: z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres.').max(120, 'O título deve ter no máximo 120 caracteres.'),
  description: z.string().trim().max(2000, 'A descrição deve ter no máximo 2000 caracteres.').optional().nullable(),
  priority: ticketPrioritySchema.default('MEDIUM'),
  categoryId: z.coerce.number().int('Categoria inválida.').positive('Categoria inválida.'),
  dynamicFields: z.record(z.string(), z.unknown()).optional().default({})
})

export const updateTicketStatusSchema = z.object({
  status: ticketStatusSchema
})

export const updateTicketEstimateSchema = z.object({
  estimatedAt: z.iso.datetime({ offset: true })
})

export const createTicketCategorySchema = z.object({
  name: z.string().trim().min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.').max(80, 'O nome da categoria deve ter no máximo 80 caracteres.'),
  description: z.string().trim().max(255, 'A descrição deve ter no máximo 255 caracteres.').optional().nullable(),
  active: z.boolean().optional().default(true)
})

export const updateTicketCategorySchema = createTicketCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização.'
  })

const ticketFieldOptionsSchema = z.array(z.object({
  label: z.string().trim().min(1, 'A opção precisa ter um nome.'),
  value: z.string().trim().min(1, 'A opção precisa ter um valor.')
}))

const ticketFieldBaseSchema = z.object({
  categoryId: z.coerce.number().int('Categoria inválida.').positive('Categoria inválida.'),
  name: z.string().trim().min(2, 'O identificador do campo deve ter pelo menos 2 caracteres.').max(60, 'O identificador do campo deve ter no máximo 60 caracteres.').regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'O identificador deve começar com letra e conter apenas letras, números e underline.'),
  label: z.string().trim().min(2, 'O label deve ter pelo menos 2 caracteres.').max(100, 'O label deve ter no máximo 100 caracteres.'),
  type: ticketFieldTypeSchema,
  required: z.boolean().optional().default(false),
  placeholder: z.string().trim().max(120, 'O placeholder deve ter no máximo 120 caracteres.').optional().nullable(),
  order: z.coerce.number().int().min(0).optional().default(0),
  options: ticketFieldOptionsSchema.optional().nullable()
})

function validateFieldOptions(data, ctx) {
  if (data.type === 'SELECT' && (!data.options || data.options.length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['options'], message: 'Campos do tipo SELECT precisam ter opções.' })
  }

  if (data.type !== 'SELECT' && data.options && data.options.length > 0) {
    ctx.addIssue({ code: 'custom', path: ['options'], message: 'Apenas campos do tipo SELECT podem ter opções.' })
  }
}

export const createTicketFieldSchema = ticketFieldBaseSchema.superRefine(validateFieldOptions)

export const updateTicketFieldSchema = ticketFieldBaseSchema
  .omit({ categoryId: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização.'
  })

export const listTicketsQuerySchema = z.object({
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  schoolId: z.coerce.number().int('Escola inválida.').positive('Escola inválida.').optional(),
  categoryId: z.coerce.number().int('Categoria inválida.').positive('Categoria inválida.').optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
})

export const ticketIdSchema = z.coerce.number().int('Identificador inválido.').positive('Identificador inválido.')
