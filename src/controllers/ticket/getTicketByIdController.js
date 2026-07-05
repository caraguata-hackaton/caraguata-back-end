import { getTicketById } from '../../models/ticketModel.js'
import { ticketIdSchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function getTicketByIdController(req, res, next) {
  try {
    const validation = ticketIdSchema.safeParse(req.params.id)
    if (!validation.success) return sendValidationError(res, validation.error)

    const ticket = await getTicketById(validation.data, res.locals.userId)
    return res.status(200).json({ ticket })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
