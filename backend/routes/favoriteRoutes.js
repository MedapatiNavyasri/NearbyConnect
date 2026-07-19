import express from 'express'
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, requireRole('customer'), addFavorite)
router.delete('/', protect, requireRole('customer'), removeFavorite)
router.get('/', protect, requireRole('customer'), getFavorites)

export default router
