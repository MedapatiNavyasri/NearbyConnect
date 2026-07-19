import mongoose from 'mongoose'

const communityUpdateSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('CommunityUpdate', communityUpdateSchema)
