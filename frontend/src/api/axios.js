import axios from 'axios'

// Set VITE_API_URL in a .env file at the frontend root to point elsewhere
// (e.g. your deployed Render URL). Defaults to local backend for development.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL })

// Attach the saved JWT (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Surface backend error messages consistently so pages can show them in toasts.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request ? 'Cannot reach the server — is the backend running?' : error.message)
    return Promise.reject(new Error(message))
  }
)

export default api
