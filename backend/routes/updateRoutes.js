import express from 'express'
import { createUpdate, getUpdatesForShop } from '../controllers/updateController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, requireRole('owner'), createUpdate)
router.get('/:shopId', getUpdatesForShop)

export default router
