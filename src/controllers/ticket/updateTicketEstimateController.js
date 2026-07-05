import { updateTicketEstimate } from '../../models/ticketModel.js'
import { ticketIdSchema, updateTicketEstimateSchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function updateTicketEstimateController(req, res, next) {
  try {
    const idValidation = ticketIdSchema.safeParse(req.params.id)
    if (!idValidation.success) return sendValidationError(res, idValidation.error)

    const bodyValidation = updateTicketEstimateSchema.safeParse(req.body)
    if (!bodyValidation.success) return sendValidationError(res, bodyValidation.error)

    const ticket = await updateTicketEstimate(idValidation.data, bodyValidation.data, res.locals.userId)
    return res.status(200).json({ message: 'Estimativa do chamado atualizada com sucesso!', ticket })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
