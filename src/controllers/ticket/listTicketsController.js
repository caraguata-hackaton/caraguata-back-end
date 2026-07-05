import { listTickets } from '../../models/ticketModel.js'
import { listTicketsQuerySchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function listTicketsController(req, res, next) {
  try {
    const validation = listTicketsQuerySchema.safeParse(req.query)
    if (!validation.success) return sendValidationError(res, validation.error)

    const result = await listTickets(res.locals.userId, validation.data)
    return res.status(200).json(result)
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
