import mongoose from 'mongoose'

const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    village: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    description: { type: String },
    openingHours: { type: String },
    logo: { type: String },
    cover: { type: String },
    gallery: [{ type: String }],
    services: [{ type: String }],
    offers: [
      {
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

shopSchema.index({ village: 1, category: 1 })

export default mongoose.model('Shop', shopSchema)
