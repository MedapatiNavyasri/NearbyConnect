import Shop from '../models/Shop.js'

export async function getPendingShops(req, res, next) {
  try {
    const shops = await Shop.find({ status: 'pending' }).populate('owner', 'name email mobile')
    res.json(shops)
  } catch (err) {
    next(err)
  }
}

export async function approveShop(req, res, next) {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.shopId,
      { status: 'approved', verified: true },
      { new: true }
    )
    if (!shop) return res.status(404).json({ message: 'Business not found' })
    res.json(shop)
  } catch (err) {
    next(err)
  }
}

export async function rejectShop(req, res, next) {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.shopId,
      { status: 'rejected', verified: false },
      { new: true }
    )
    if (!shop) return res.status(404).json({ message: 'Business not found' })
    res.json(shop)
  } catch (err) {
    next(err)
  }
}
