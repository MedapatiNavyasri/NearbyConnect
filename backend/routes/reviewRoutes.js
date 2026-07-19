import express from 'express'
import { createReview, getReviewsForShop } from '../controllers/reviewController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, requireRole('customer'), createReview)
router.get('/:shopId', getReviewsForShop)

export default router
