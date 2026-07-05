import { getTicketCategoryFields } from '../../models/ticketCategoryModel.js'
import { ticketIdSchema } from '../../schemas/ticketSchemas.js'
import { handleTicketError, sendValidationError } from './ticketControllerHelpers.js'

export async function getTicketCategoryFieldsController(req, res, next) {
  try {
    const validation = ticketIdSchema.safeParse(req.params.id)
    if (!validation.success) return sendValidationError(res, validation.error)

    const result = await getTicketCategoryFields(validation.data)
    const { fields, ...category } = result
    return res.status(200).json({ category, fields })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
