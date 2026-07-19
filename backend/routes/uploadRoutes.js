import express from 'express'
import { upload } from '../config/cloudinary.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Single image (logo / cover)
router.post('/single', protect, requireRole('owner'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' })
  res.json({ url: req.file.path })
})

// Multiple images (gallery)
router.post('/gallery', protect, requireRole('owner'), upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No images uploaded' })
  res.json({ urls: req.files.map((f) => f.path) })
})

export default router
