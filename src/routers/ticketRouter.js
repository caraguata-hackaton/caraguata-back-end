import express from 'express'
import { authentication } from '../middlewares/authentication.js'
import { requireRole } from '../middlewares/requireRole.js'
import { createTicketController } from '../controllers/ticket/createTicketController.js'
import { listTicketsController } from '../controllers/ticket/listTicketsController.js'
import { getTicketByIdController } from '../controllers/ticket/getTicketByIdController.js'
import { updateTicketStatusController } from '../controllers/ticket/updateTicketStatusController.js'
import { updateTicketEstimateController } from '../controllers/ticket/updateTicketEstimateController.js'
import { listTicketCategoriesController } from '../controllers/ticket/listTicketCategoriesController.js'
import { getTicketCategoryFieldsController } from '../controllers/ticket/getTicketCategoryFieldsController.js'
import { createTicketCategoryController } from '../controllers/ticket/createTicketCategoryController.js'
import { createTicketFieldController } from '../controllers/ticket/createTicketFieldController.js'

const router = express.Router()

router.get('/tickets', authentication, requireRole('SCHOOL_USER', 'MANAGER'), listTicketsController)
router.post('/tickets', authentication, requireRole('SCHOOL_USER'), createTicketController)
router.get('/tickets/:id', authentication, requireRole('SCHOOL_USER', 'MANAGER'), getTicketByIdController)
router.patch('/tickets/:id/status', authentication, requireRole('MANAGER'), updateTicketStatusController)
router.patch('/tickets/:id/estimate', authentication, requireRole('MANAGER'), updateTicketEstimateController)

router.get('/ticket-categories', authentication, requireRole('SCHOOL_USER', 'MANAGER'), listTicketCategoriesController)
router.get('/ticket-categories/:id/fields', authentication, requireRole('SCHOOL_USER', 'MANAGER'), getTicketCategoryFieldsController)
router.post('/ticket-categories', authentication, requireRole('MANAGER'), createTicketCategoryController)
router.post('/ticket-fields', authentication, requireRole('MANAGER'), createTicketFieldController)

export default router
