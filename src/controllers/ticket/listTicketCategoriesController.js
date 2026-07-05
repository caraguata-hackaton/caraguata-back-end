import { listTicketCategories } from '../../models/ticketCategoryModel.js'
import { handleTicketError } from './ticketControllerHelpers.js'

export async function listTicketCategoriesController(req, res, next) {
  try {
    const categories = await listTicketCategories()
    return res.status(200).json({ categories })
  } catch (error) {
    return handleTicketError(error, res, next)
  }
}
