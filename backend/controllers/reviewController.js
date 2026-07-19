import Review from '../models/Review.js'
import Shop from '../models/Shop.js'

export async function createReview(req, res, next) {
  try {
    const { shopId, rating, comment } = req.body
    if (!shopId || !rating) return res.status(400).json({ message: 'shopId and rating are required' })

    const review = await Review.create({ shop: shopId, customer: req.user.id, rating, comment })

    const shop = await Shop.findById(shopId)
    if (shop) {
      const newCount = shop.reviewCount + 1
      shop.rating = ((shop.rating * shop.reviewCount) + rating) / newCount
      shop.reviewCount = newCount
      await shop.save()
    }

    res.status(201).json(review)
  } catch (err) {
    next(err)
  }
}

export async function getReviewsForShop(req, res, next) {
  try {
    const reviews = await Review.find({ shop: req.params.shopId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    next(err)
  }
}
