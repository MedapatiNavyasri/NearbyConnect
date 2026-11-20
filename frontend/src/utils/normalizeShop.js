
export function normalizeShop(shop) {
  return {
    id: shop._id || shop.id,
    name: shop.shopName || shop.name,
    category: shop.category,
    village: shop.village,
    distanceMins: shop.distanceMins ?? null,
    rating: shop.rating || 0,
    reviewCount: shop.reviewCount || 0,
    verified: !!shop.verified,
    openNow: shop.openNow ?? true,
    hours: shop.openingHours || 'Hours not provided',
    phone: shop.phone,
    whatsapp: shop.whatsapp,
    address: shop.address,
    description: shop.description,
    services: shop.services || [],
    cover: shop.cover || '',
    gallery: shop.gallery || [],
    updates: shop.updates || [],
    reviews: shop.reviews || [],
  }
}
