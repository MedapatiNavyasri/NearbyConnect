import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  { timestamps: true }
)

favoriteSchema.index({ customer: 1, shop: 1 }, { unique: true })

export default mongoose.model('Favorite', favoriteSchema)
