import React, { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiGrid, FiBriefcase, FiImage, FiTag, FiMessageSquare, FiStar, FiBarChart2, FiSettings, FiSend,
} from 'react-icons/fi'
import { useApp } from '../context/AppContext.jsx'
import * as shopsApi from '../api/shops.js'
import * as miscApi from '../api/misc.js'

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { id: 'profile', label: 'Business Profile', icon: <FiBriefcase /> },
  { id: 'gallery', label: 'Gallery', icon: <FiImage /> },
  { id: 'offers', label: 'Offers', icon: <FiTag /> },
  { id: 'updates', label: 'Community Updates', icon: <FiMessageSquare /> },
  { id: 'reviews', label: 'Reviews', icon: <FiStar /> },
  { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
]

function completionPercent(shop) {
  if (!shop) return 0
  const fields = [shop.shopName, shop.description, shop.openingHours, shop.cover, shop.logo, shop.services?.length]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default function OwnerDashboard() {
  const { user, logout } = useApp()
  const [section, setSection] = useState('dashboard')
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [updateText, setUpdateText] = useState('')
  const [updates, setUpdates] = useState([])
  const [offerText, setOfferText] = useState('')
  const [reviews, setReviews] = useState([])
  const [profileForm, setProfileForm] = useState({ shopName: '', description: '', openingHours: '' })
  const [galleryFiles, setGalleryFiles] = useState([])

  const loadShop = () => {
    setLoading(true)
    shopsApi
      .getMyShop()
      .then((s) => {
        setShop(s)
        setProfileForm({ shopName: s.shopName || '', description: s.description || '', openingHours: s.openingHours || '' })
      })
      .catch(() => setShop(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (user?.role === 'owner') loadShop()
  }, [user])

  useEffect(() => {
    if (!shop?._id) return
    if (section === 'updates') {
      miscApi.getUpdatesForShop(shop._id).then(setUpdates).catch((err) => toast.error(err.message))
    }
    if (section === 'reviews') {
      miscApi.getReviewsForShop(shop._id).then(setReviews).catch((err) => toast.error(err.message))
    }
  }, [section, shop?._id])

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-ink/50">Loading your business...</div>
  }

  if (!shop) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🏪</p>
        <h1 className="font-display text-xl font-semibold mb-2">You haven't registered a business yet</h1>
        <p className="text-ink/60 mb-6">Register your shop to get a dashboard, community updates, and more.</p>
        <Link to="/register-shop" className="btn-press bg-primary text-white font-semibold rounded-full px-6 py-3">
          Register Your Business
        </Link>
      </div>
    )
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const updated = await shopsApi.updateShop(shop._id, profileForm)
      setShop(updated)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const uploadGallery = async () => {
    if (galleryFiles.length === 0) {
      toast.error('Choose photos first')
      return
    }
    setSaving(true)
    try {
      const { urls } = await miscApi.uploadGalleryImages(galleryFiles)
      const updated = await shopsApi.updateShop(shop._id, { gallery: [...(shop.gallery || []), ...urls] })
      setShop(updated)
      setGalleryFiles([])
      toast.success('Photos added to your gallery')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const postOffer = async () => {
    if (!offerText.trim()) {
      toast.error('Write an offer first')
      return
    }
    setSaving(true)
    try {
      const newOffers = [{ message: offerText, createdAt: new Date().toISOString() }, ...(shop.offers || [])]
      const updated = await shopsApi.updateShop(shop._id, { offers: newOffers })
      setShop(updated)
      setOfferText('')
      toast.success('Offer posted to your business page')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const postUpdate = async () => {
    if (!updateText.trim()) {
      toast.error('Write something to post')
      return
    }
    try {
      const created = await miscApi.createUpdate({ shopId: shop._id, message: updateText })
      setUpdates((u) => [created, ...u])
      setUpdateText('')
      toast.success('Update posted to your business page')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-[240px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="bg-white border border-line rounded-xl2 p-3 h-fit md:sticky md:top-24">
        <div className="px-3 py-3 mb-1">
          <p className="font-display font-semibold">{user.name}</p>
          <p className="text-xs text-ink/50">{shop.shopName} · {shop.status === 'approved' ? 'Live' : shop.status}</p>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={`flex items-center gap-2.5 text-sm font-semibold rounded-xl px-3.5 py-2.5 whitespace-nowrap text-left
                ${section === n.id ? 'bg-primary text-white' : 'text-ink/70 hover:bg-paper'}`}
            >
              {n.icon} {n.label}
            </button>
          ))}
          <button onClick={logout} className="flex items-center gap-2.5 text-sm font-semibold rounded-xl px-3.5 py-2.5 text-terracotta hover:bg-paper whitespace-nowrap">
            Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <div>
        {section === 'dashboard' && (
          <div>
            <h1 className="font-display text-2xl font-semibold mb-2">Welcome back, {user.name}</h1>
            {shop.status !== 'approved' && (
              <p className="text-sm bg-accent/20 text-accent-dark font-semibold rounded-full px-4 py-2 w-fit mb-6">
                {shop.status === 'pending' ? 'Waiting for admin approval' : 'Your business was rejected — contact support'}
              </p>
            )}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Profile Completion', value: `${completionPercent(shop)}%` },
                { label: 'Reviews', value: shop.reviewCount || 0 },
                { label: 'Average Rating', value: shop.rating ? `${shop.rating.toFixed(1)}★` : '—' },
                { label: 'Status', value: shop.verified ? 'Verified' : 'Not verified' },
              ].map((c) => (
                <div key={c.label} className="bg-white border border-line rounded-xl2 p-5 shadow-card">
                  <p className="font-display text-2xl font-semibold text-primary">{c.value}</p>
                  <p className="text-xs text-ink/50 mt-1">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'profile' && (
          <div className="bg-white border border-line rounded-xl2 p-6 max-w-xl">
            <h2 className="font-display text-xl font-semibold mb-4">Business Profile</h2>
            <div className="flex flex-col gap-4">
              <input
                value={profileForm.shopName}
                onChange={(e) => setProfileForm((f) => ({ ...f, shopName: e.target.value }))}
                placeholder="Business name"
                className="border border-line rounded-xl px-4 py-3 focus:border-primary outline-none"
              />
              <textarea
                value={profileForm.description}
                onChange={(e) => setProfileForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description"
                rows={3}
                className="border border-line rounded-xl px-4 py-3 focus:border-primary outline-none"
              />
              <input
                value={profileForm.openingHours}
                onChange={(e) => setProfileForm((f) => ({ ...f, openingHours: e.target.value }))}
                placeholder="Opening hours"
                className="border border-line rounded-xl px-4 py-3 focus:border-primary outline-none"
              />
              <button onClick={saveProfile} disabled={saving} className="btn-press bg-primary text-white font-semibold rounded-full py-3 mt-1 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        )}

        {section === 'gallery' && (
          <div className="bg-white border border-line rounded-xl2 p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Gallery</h2>
            {shop.gallery?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {shop.gallery.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-full h-28 object-cover rounded-lg" />
                ))}
              </div>
            )}
            <label className="border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-2 py-10 text-ink/50 cursor-pointer hover:border-primary hover:text-primary transition-colors">
              <FiImage size={22} />
              <span className="text-sm font-semibold">
                {galleryFiles.length ? `${galleryFiles.length} photo(s) selected` : 'Click to choose photos'}
              </span>
              <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} />
            </label>
            <button onClick={uploadGallery} disabled={saving} className="btn-press bg-primary text-white font-semibold rounded-full px-6 py-2.5 mt-4 disabled:opacity-60">
              {saving ? 'Uploading...' : 'Upload photos'}
            </button>
          </div>
        )}

        {section === 'offers' && (
          <div>
            <div className="bg-white border border-line rounded-xl2 p-6 max-w-xl mb-6">
              <h2 className="font-display text-xl font-semibold mb-4">Post a Daily Offer</h2>
              <textarea
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                placeholder="e.g. Free home delivery this evening"
                rows={2}
                className="w-full border border-line rounded-xl px-4 py-3 focus:border-primary outline-none mb-3"
              />
              <button onClick={postOffer} disabled={saving} className="btn-press bg-accent text-ink font-bold rounded-full px-6 py-3 disabled:opacity-60">
                {saving ? 'Posting...' : 'Post Offer'}
              </button>
            </div>
            <div className="flex flex-col gap-3 max-w-xl">
              {(shop.offers || []).map((o, i) => (
                <div key={i} className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                  <p>{o.message}</p>
                  <p className="text-xs text-ink/50 mt-1.5">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'updates' && (
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Community Updates</h2>
            <div className="bg-white border border-line rounded-xl2 p-5 mb-6 flex gap-3">
              <input
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Fresh stock arrived, open till 11 PM..."
                className="flex-1 border border-line rounded-xl px-4 py-3 focus:border-primary outline-none"
              />
              <button onClick={postUpdate} className="btn-press bg-primary text-white font-semibold rounded-full px-5 flex items-center gap-2">
                <FiSend /> Post
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {updates.map((u) => (
                <div key={u._id} className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                  <p>{u.message}</p>
                  <p className="text-xs text-ink/50 mt-1.5">{new Date(u.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {updates.length === 0 && <p className="text-ink/50 text-sm">No updates posted yet.</p>}
            </div>
          </div>
        )}

        {section === 'reviews' && (
          <div className="bg-white border border-line rounded-xl2 p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div key={r._id} className="border border-line rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.customer?.name || 'Customer'}</p>
                      <span className="text-accent-dark font-semibold text-sm">{r.rating}★</span>
                    </div>
                    <p className="text-sm text-ink/70 mt-1.5">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink/60 text-sm">No reviews yet — they'll appear here as customers leave them.</p>
            )}
          </div>
        )}

        {section === 'analytics' && (
          <div className="bg-white border border-line rounded-xl2 p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Analytics</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-paper rounded-xl p-4 text-center">
                <p className="font-display text-xl font-semibold text-primary">{shop.reviewCount || 0}</p>
                <p className="text-xs text-ink/50 mt-1">Total reviews</p>
              </div>
              <div className="bg-paper rounded-xl p-4 text-center">
                <p className="font-display text-xl font-semibold text-primary">{shop.rating ? shop.rating.toFixed(1) : '—'}</p>
                <p className="text-xs text-ink/50 mt-1">Average rating</p>
              </div>
              <div className="bg-paper rounded-xl p-4 text-center">
                <p className="font-display text-xl font-semibold text-primary">{(shop.gallery || []).length}</p>
                <p className="text-xs text-ink/50 mt-1">Gallery photos</p>
              </div>
            </div>
            <p className="text-xs text-ink/40 mt-4">
              Page-view and call-tracking counters need a small backend addition — ask me to add them when you're ready.
            </p>
          </div>
        )}

        {section === 'settings' && (
          <div className="bg-white border border-line rounded-xl2 p-6 max-w-md">
            <h2 className="font-display text-xl font-semibold mb-4">Settings</h2>
            <p className="text-sm text-ink/60">
              Changing your login email or password isn't wired up yet — it needs a couple of new,
              carefully-secured backend endpoints. Ask me when you'd like this added.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
