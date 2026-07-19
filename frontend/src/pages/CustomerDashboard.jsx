import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { FiHeart, FiStar, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'
import * as miscApi from '../api/misc.js'
import { normalizeShop } from '../utils/normalizeShop.js'
import BusinessCard from '../components/BusinessCard.jsx'
import { useApp } from '../context/AppContext.jsx'

const tabs = [
  { id: 'favorites', label: 'Favorites', icon: <FiHeart /> },
  { id: 'reviews', label: 'My Reviews', icon: <FiStar /> },
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
]

export default function CustomerDashboard() {
  const { user, favorites } = useApp()
  const [tab, setTab] = useState('favorites')
  const [favoriteBusinesses, setFavoriteBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    miscApi
      .getFavorites()
      .then((favs) => {
        // Each favorite record comes back with the shop already populated.
        const shops = favs.map((f) => normalizeShop(f.shop)).filter((s) => s.name)
        setFavoriteBusinesses(shops)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [user, favorites])

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-1">Hi, {user.name} 👋</h1>
      <p className="text-ink/60 mb-8">Manage your favorites, reviews, and profile.</p>

      <div className="flex gap-2 mb-8 bg-white border border-line rounded-full p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 transition-colors
              ${tab === t.id ? 'bg-primary text-white' : 'text-ink/60 hover:text-ink'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'favorites' && (
        loading ? (
          <p className="text-ink/50">Loading your favorites...</p>
        ) : favoriteBusinesses.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteBusinesses.map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
        ) : (
          <div className="bg-white border border-line rounded-xl2 p-14 text-center">
            <p className="text-5xl mb-4">💛</p>
            <h3 className="font-display text-xl font-semibold mb-1">No favorites yet</h3>
            <p className="text-ink/60">Tap the heart on any business to save it here.</p>
          </div>
        )
      )}

      {tab === 'reviews' && (
        <div className="bg-white border border-line rounded-xl2 p-14 text-center">
          <p className="text-5xl mb-4">📝</p>
          <h3 className="font-display text-xl font-semibold mb-1">No reviews yet</h3>
          <p className="text-ink/60">Reviews you write on business pages will show up here.</p>
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-white border border-line rounded-xl2 p-8 max-w-md">
          <h3 className="font-display text-lg font-semibold mb-4">Your details</h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-ink/50 mb-1">Name</p>
              <input defaultValue={user.name} className="w-full border border-line rounded-xl px-4 py-3 focus:border-primary outline-none" />
            </div>
            <div>
              <p className="text-xs text-ink/50 mb-1">Email</p>
              <input defaultValue={user.email || ''} className="w-full border border-line rounded-xl px-4 py-3 focus:border-primary outline-none" />
            </div>
            <button className="btn-press bg-primary text-white font-semibold rounded-full py-3 mt-2">
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
