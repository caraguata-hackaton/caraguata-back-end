import express from 'express'
import { getUsersController } from '../controllers/user/getUsersController.js'
import { createUsersController } from '../controllers/user/createUserController.js'
import { updateUsersController } from '../controllers/user/updateUserController.js'
import { deleteUsersController } from '../controllers/user/deleteUserController.js'
import { authentication } from '../middlewares/authentication.js'
import { getUserByIdController } from "../controllers/user/getUserByIdController.js";

const router = express.Router()

router.get('/', getUsersController)
router.get('/:id', getUserByIdController)
router.post('/', createUsersController)
router.put('/:id', authentication, updateUsersController)
router.delete('/:id', deleteUsersController)

export default router
