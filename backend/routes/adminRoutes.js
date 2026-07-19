import express from 'express'
import { getPendingShops, approveShop, rejectShop } from '../controllers/adminController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/pending', protect, requireRole('admin'), getPendingShops)
router.put('/approve/:shopId', protect, requireRole('admin'), approveShop)
router.put('/reject/:shopId', protect, requireRole('admin'), rejectShop)

export default router
