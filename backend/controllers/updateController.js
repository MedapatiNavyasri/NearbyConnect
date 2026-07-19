import CommunityUpdate from '../models/CommunityUpdate.js'
import Shop from '../models/Shop.js'

export async function createUpdate(req, res, next) {
  try {
    const { shopId, message } = req.body
    if (!shopId || !message) return res.status(400).json({ message: 'shopId and message are required' })

    const shop = await Shop.findById(shopId)
    if (!shop) return res.status(404).json({ message: 'Business not found' })
    if (String(shop.owner) !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this business' })
    }

    const update = await CommunityUpdate.create({ shop: shopId, message })
    res.status(201).json(update)
  } catch (err) {
    next(err)
  }
}

export async function getUpdatesForShop(req, res, next) {
  try {
    const updates = await CommunityUpdate.find({ shop: req.params.shopId }).sort({ createdAt: -1 })
    res.json(updates)
  } catch (err) {
    next(err)
  }
}
