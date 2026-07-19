import express from 'express'
import { getShops, getMyShop, getShopById, createShop, updateShop, deleteShop } from '../controllers/shopController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getShops)
router.get('/mine', protect, requireRole('owner'), getMyShop)
router.get('/:id', getShopById)
router.post('/', protect, requireRole('owner'), createShop)
router.put('/:id', protect, requireRole('owner', 'admin'), updateShop)
router.delete('/:id', protect, requireRole('owner', 'admin'), deleteShop)

export default router
