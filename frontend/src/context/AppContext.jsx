import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth.js'
import * as miscApi from '../api/misc.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null) // { id, name, email, role }
  const [authLoading, setAuthLoading] = useState(true)
  const [village, setVillage] = useState(() => localStorage.getItem('nc_village') || '')
  const [favorites, setFavorites] = useState([]) // array of shop ids

  useEffect(() => {
    if (village) localStorage.setItem('nc_village', village)
  }, [village])

  // On first load, restore the session from a saved token + user, if any.
  useEffect(() => {
    const token = localStorage.getItem('nc_token')
    const savedUser = localStorage.getItem('nc_user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('nc_token')
        localStorage.removeItem('nc_user')
      }
    }
    setAuthLoading(false)
  }, [])

  // Load this user's favorites from the backend once logged in as a customer.
  useEffect(() => {
    if (user?.role === 'customer') {
      miscApi
        .getFavorites()
        .then((favs) => setFavorites(favs.map((f) => f.shop?._id || f.shop)))
        .catch(() => setFavorites([]))
    } else {
      setFavorites([])
    }
  }, [user])

  const persistSession = (token, userData) => {
    localStorage.setItem('nc_token', token)
    localStorage.setItem('nc_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const { token, user: userData } = await authApi.login({ email, password })
    persistSession(token, userData)
    return userData
  }

  const registerCustomer = async (form) => {
    const { token, user: userData } = await authApi.registerCustomer(form)
    persistSession(token, userData)
    return userData
  }

  const registerOwner = async (form) => {
    const { token, user: userData } = await authApi.registerOwner(form)
    persistSession(token, userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('nc_token')
    localStorage.removeItem('nc_user')
    setUser(null)
    setFavorites([])
  }

  const toggleFavorite = async (shopId) => {
    const isFav = favorites.includes(shopId)
    // Optimistic update
    setFavorites((prev) => (isFav ? prev.filter((id) => id !== shopId) : [...prev, shopId]))
    try {
      if (isFav) {
        await miscApi.removeFavorite(shopId)
      } else {
        await miscApi.addFavorite(shopId)
      }
    } catch (err) {
      // Revert on failure
      setFavorites((prev) => (isFav ? [...prev, shopId] : prev.filter((id) => id !== shopId)))
      throw err
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        login,
        registerCustomer,
        registerOwner,
        logout,
        village,
        setVillage,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
