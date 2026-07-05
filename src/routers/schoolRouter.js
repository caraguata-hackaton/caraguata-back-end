import express from 'express'
import {getSchoolsController} from "../controllers/school/getSchoolsController.js";
import {createSchoolsController} from "../controllers/school/createSchoolController.js";
import {updateSchoolController} from "../controllers/school/updateSchoolController.js";
import {deleteSchoolController} from "../controllers/school/deleteSchoolController.js";
import {getSchoolByIdController} from "../controllers/school/getSchoolByIdController.js";

const router = express.Router()

router.get('/', getSchoolsController)
router.get('/:id', getSchoolByIdController)
router.post('/', createSchoolsController)
router.put('/:id', updateSchoolController)
router.delete('/:id', deleteSchoolController)

export default router