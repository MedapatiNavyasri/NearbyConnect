import Shop from '../models/Shop.js'

export async function getShops(req, res, next) {
  try {
    const { category, village, search, openNow, minRating } = req.query
    const filter = { status: 'approved' }
    if (category) filter.category = category
    if (village) filter.village = village
    if (search) filter.shopName = { $regex: search, $options: 'i' }
    if (minRating) filter.rating = { $gte: Number(minRating) }

    const shops = await Shop.find(filter).sort({ createdAt: -1 })
    res.json(shops)
  } catch (err) {
    next(err)
  }
}

export async function getMyShop(req, res, next) {
  try {
    const shop = await Shop.findOne({ owner: req.user.id })
    if (!shop) return res.status(404).json({ message: 'You have not registered a business yet' })
    res.json(shop)
  } catch (err) {
    next(err)
  }
}

export async function getShopById(req, res, next) {
  try {
    const shop = await Shop.findById(req.params.id)
    if (!shop) return res.status(404).json({ message: 'Business not found' })
    res.json(shop)
  } catch (err) {
    next(err)
  }
}

export async function createShop(req, res, next) {
  try {
    const shop = await Shop.create({ ...req.body, owner: req.user.id, status: 'pending', verified: false })
    res.status(201).json(shop)
  } catch (err) {
    next(err)
  }
}

export async function updateShop(req, res, next) {
  try {
    const shop = await Shop.findById(req.params.id)
    if (!shop) return res.status(404).json({ message: 'Business not found' })
    if (String(shop.owner) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not own this business' })
    }
    Object.assign(shop, req.body)
    await shop.save()
    res.json(shop)
  } catch (err) {
    next(err)
  }
}

export async function deleteShop(req, res, next) {
  try {
    const shop = await Shop.findById(req.params.id)
    if (!shop) return res.status(404).json({ message: 'Business not found' })
    if (String(shop.owner) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not own this business' })
    }
    await shop.deleteOne()
    res.json({ message: 'Business removed' })
  } catch (err) {
    next(err)
  }
}
