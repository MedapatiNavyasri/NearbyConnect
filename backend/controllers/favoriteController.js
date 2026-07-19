import Favorite from '../models/Favorite.js'

export async function addFavorite(req, res, next) {
  try {
    const { shopId } = req.body
    const favorite = await Favorite.findOneAndUpdate(
      { customer: req.user.id, shop: shopId },
      { customer: req.user.id, shop: shopId },
      { upsert: true, new: true }
    )
    res.status(201).json(favorite)
  } catch (err) {
    next(err)
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { shopId } = req.body
    await Favorite.findOneAndDelete({ customer: req.user.id, shop: shopId })
    res.json({ message: 'Removed from favorites' })
  } catch (err) {
    next(err)
  }
}

export async function getFavorites(req, res, next) {
  try {
    const favorites = await Favorite.find({ customer: req.user.id }).populate('shop')
    res.json(favorites)
  } catch (err) {
    next(err)
  }
}
