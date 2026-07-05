import { updateTicketStatus } from '../../models/ticketModel.js'
import { ticketIdSchema, updateTicketStatusSchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function updateTicketStatusController(req, res, next) {
  try {
    const idValidation = ticketIdSchema.safeParse(req.params.id)
    if (!idValidation.success) return sendValidationError(res, idValidation.error)

    const bodyValidation = updateTicketStatusSchema.safeParse(req.body)
    if (!bodyValidation.success) return sendValidationError(res, bodyValidation.error)

    const ticket = await updateTicketStatus(idValidation.data, bodyValidation.data, res.locals.userId)
    return res.status(200).json({ message: 'Status do chamado atualizado com sucesso!', ticket })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
