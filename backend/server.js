import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import shopRoutes from './routes/shopRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import updateRoutes from './routes/updateRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'NearbyConnect API' }))

app.use('/api/auth', authRoutes)
app.use('/api/shops', shopRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/updates', updateRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/upload', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`NearbyConnect API running on port ${PORT}`))
})
