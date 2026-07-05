import { createTicket } from '../../models/ticketModel.js'
import { createTicketSchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function createTicketController(req, res, next) {
  try {
    const validation = createTicketSchema.safeParse(req.body)
    if (!validation.success) return sendValidationError(res, validation.error)

    const ticket = await createTicket(validation.data, res.locals.userId)
    return res.status(201).json({ message: 'Chamado criado com sucesso!', ticket })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
