import { createTicketField } from '../../models/ticketCategoryModel.js'
import { createTicketFieldSchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function createTicketFieldController(req, res, next) {
  try {
    const validation = createTicketFieldSchema.safeParse(req.body)
    if (!validation.success) return sendValidationError(res, validation.error)

    const field = await createTicketField(validation.data)
    return res.status(201).json({ message: 'Campo criado com sucesso!', field })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
