import api from './axios.js'

export const getShops = (params) => api.get('/shops', { params }).then((r) => r.data)
export const getMyShop = () => api.get('/shops/mine').then((r) => r.data)
export const getShopById = (id) => api.get(`/shops/${id}`).then((r) => r.data)
export const createShop = (data) => api.post('/shops', data).then((r) => r.data)
export const updateShop = (id, data) => api.put(`/shops/${id}`, data).then((r) => r.data)
export const deleteShop = (id) => api.delete(`/shops/${id}`).then((r) => r.data)
