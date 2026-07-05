import { createTicketCategory } from '../../models/ticketCategoryModel.js'
import { createTicketCategorySchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function createTicketCategoryController(req, res, next) {
  try {
    const validation = createTicketCategorySchema.safeParse(req.body)
    if (!validation.success) return sendValidationError(res, validation.error)

    const category = await createTicketCategory(validation.data)
    return res.status(201).json({ message: 'Categoria criada com sucesso!', category })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
