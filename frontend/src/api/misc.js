import api from './axios.js'

// Reviews
export const createReview = (data) => api.post('/reviews', data).then((r) => r.data)
export const getReviewsForShop = (shopId) => api.get(`/reviews/${shopId}`).then((r) => r.data)

// Community updates
export const createUpdate = (data) => api.post('/updates', data).then((r) => r.data)
export const getUpdatesForShop = (shopId) => api.get(`/updates/${shopId}`).then((r) => r.data)

// Favorites
export const addFavorite = (shopId) => api.post('/favorites', { shopId }).then((r) => r.data)
export const removeFavorite = (shopId) => api.delete('/favorites', { data: { shopId } }).then((r) => r.data)
export const getFavorites = () => api.get('/favorites').then((r) => r.data)

// Admin
export const getPendingShops = () => api.get('/admin/pending').then((r) => r.data)
export const approveShop = (shopId) => api.put(`/admin/approve/${shopId}`).then((r) => r.data)
export const rejectShop = (shopId) => api.put(`/admin/reject/${shopId}`).then((r) => r.data)

// Uploads
export const uploadSingleImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
}
export const uploadGalleryImages = (files) => {
  const formData = new FormData()
  files.forEach((f) => formData.append('images', f))
  return api.post('/upload/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
}
