// The backend Shop document uses Mongo's _id/shopName naming, and doesn't
// track live "open now" status or walking distance (that would need real
// geolocation + business hours parsing, which is a good next feature to add).
// This adapter maps it to the shape the UI components already use.
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
    openNow: shop.openNow ?? true, // placeholder until real hours-based logic is added
    hours: shop.openingHours || 'Hours not provided',
    phone: shop.phone,
    whatsapp: shop.whatsapp,
    address: shop.address,
    description: shop.description,
    services: shop.services || [],
    cover: shop.cover || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
    gallery: shop.gallery || [],
    updates: shop.updates || [],
    reviews: shop.reviews || [],
  }
}
