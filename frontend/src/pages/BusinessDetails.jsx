import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiPhoneCall, FiMessageCircle, FiNavigation, FiStar, FiClock, FiMapPin, FiHeart,
} from 'react-icons/fi'
import * as shopsApi from '../api/shops.js'
import * as miscApi from '../api/misc.js'
import { normalizeShop } from '../utils/normalizeShop.js'
import VerifiedBadge from '../components/VerifiedBadge.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function BusinessDetails() {
  const { id } = useParams()
  const [business, setBusiness] = useState(null)
  const [reviews, setReviews] = useState([])
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const { user, favorites, toggleFavorite } = useApp()
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      shopsApi.getShopById(id),
      miscApi.getReviewsForShop(id).catch(() => []),
      miscApi.getUpdatesForShop(id).catch(() => []),
    ])
      .then(([shop, reviewData, updateData]) => {
        setBusiness(normalizeShop(shop))
        setReviews(reviewData)
        setUpdates(updateData)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-ink/50">Loading business...</div>
  }

  if (notFound || !business) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">🏚️</p>
        <h1 className="font-display text-2xl font-semibold mb-2">Business not found</h1>
        <p className="text-ink/60 mb-6">This listing may have been removed.</p>
        <Link to="/explore" className="btn-press bg-primary text-white font-semibold rounded-full px-6 py-3">
          Back to Explore
        </Link>
      </div>
    )
  }

  const isFavorite = favorites.includes(business.id)

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites')
      return
    }
    try {
      await toggleFavorite(business.id)
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (err) {
      toast.error(err.message || 'Could not update favorites')
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to write a review')
      return
    }
    if (!reviewText.trim()) {
      toast.error('Please write a comment first')
      return
    }
    setSubmittingReview(true)
    try {
      const newReview = await miscApi.createReview({ shopId: business.id, rating: reviewRating, comment: reviewText })
      setReviews((r) => [{ ...newReview, customer: { name: user.name } }, ...r])
      setReviewText('')
      toast.success('Review submitted — thank you!')
    } catch (err) {
      toast.error(err.message || 'Could not submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-96 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="col-span-4 sm:col-span-2 row-span-2 rounded-xl2 overflow-hidden">
          <img src={business.cover} alt={business.name} className="w-full h-full object-cover" />
        </div>
        {business.gallery.slice(0, 2).map((img, i) => (
          <div key={i} className="hidden sm:block col-span-1 row-span-1 rounded-xl2 overflow-hidden">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-[1fr_340px] gap-10">
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {business.verified && <VerifiedBadge size="md" />}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${business.openNow ? 'bg-primary/10 text-primary' : 'bg-ink/10 text-ink/60'}`}>
                  {business.openNow ? 'Open now' : 'Closed'}
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold">{business.name}</h1>
              <p className="text-ink/60 mt-1">{business.category} · {business.village}</p>
            </div>
            <button
              onClick={handleFavorite}
              className={`btn-press flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold border
                ${isFavorite ? 'bg-terracotta text-white border-terracotta' : 'border-line hover:border-terracotta'}`}
            >
              <FiHeart className={isFavorite ? 'fill-white' : ''} /> {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-ink/70">
            <span className="flex items-center gap-1 font-semibold text-accent-dark">
              <FiStar className="fill-accent text-accent" /> {business.rating.toFixed ? business.rating.toFixed(1) : business.rating} ({business.reviewCount} reviews)
            </span>
            {business.distanceMins != null && (
              <span className="flex items-center gap-1"><FiMapPin /> {business.distanceMins} min away</span>
            )}
          </div>

          <p className="mt-6 text-ink/80 leading-relaxed">{business.description}</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white border border-line rounded-xl p-4">
              <FiClock className="text-primary shrink-0" size={20} />
              <div>
                <p className="text-xs text-ink/50">Business hours</p>
                <p className="font-semibold">{business.hours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-line rounded-xl p-4">
              <FiMapPin className="text-terracotta shrink-0" size={20} />
              <div>
                <p className="text-xs text-ink/50">Address</p>
                <p className="font-semibold">{business.address}</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold mb-3">Services</h2>
            <div className="flex flex-wrap gap-2">
              {business.services.map((s) => (
                <span key={s} className="bg-white border border-line rounded-full px-4 py-2 text-sm font-medium">
                  {s}
                </span>
              ))}
              {business.services.length === 0 && <p className="text-sm text-ink/50">No services listed yet.</p>}
            </div>
          </div>

          {updates.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold mb-3">Community Updates</h2>
              <div className="flex flex-col gap-3">
                {updates.map((u) => (
                  <div key={u._id} className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                    <p className="text-ink/90">{u.message}</p>
                    <p className="text-xs text-ink/50 mt-1.5">{new Date(u.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold mb-3">Reviews</h2>
            <div className="flex flex-col gap-3 mb-6">
              {reviews.length > 0 ? reviews.map((r) => (
                <div key={r._id} className="bg-white border border-line rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.customer?.name || 'Customer'}</p>
                    <span className="flex items-center gap-1 text-accent-dark font-semibold text-sm">
                      <FiStar className="fill-accent text-accent" /> {r.rating}
                    </span>
                  </div>
                  <p className="text-sm text-ink/70 mt-1.5">{r.comment}</p>
                </div>
              )) : (
                <p className="text-ink/50 text-sm">No reviews yet — be the first to share your experience.</p>
              )}
            </div>

            <form onSubmit={handleReviewSubmit} className="bg-white border border-line rounded-xl2 p-5">
              <p className="font-semibold mb-2">Write a review</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setReviewRating(n)}
                    aria-label={`${n} star`}
                    className={`text-2xl ${n <= reviewRating ? 'text-accent' : 'text-line'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share what you liked or how it could be better..."
                rows={3}
                className="w-full border border-line rounded-lg p-3 focus:border-primary outline-none mb-3"
              />
              <button type="submit" disabled={submittingReview} className="btn-press bg-primary text-white font-semibold rounded-full px-6 py-2.5 disabled:opacity-60">
                {submittingReview ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          </div>
        </div>

        <div className="md:sticky md:top-24 h-fit flex flex-col gap-3">
          <div className="bg-white border border-line rounded-xl2 p-5">
            <p className="font-semibold mb-4">Get in touch</p>
            <a
              href={`tel:${business.phone}`}
              className="btn-press flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-full py-3.5 mb-3 hover:bg-primary-dark"
            >
              <FiPhoneCall /> Call Now
            </a>
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-press flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold rounded-full py-3.5 mb-3"
              >
                <FiMessageCircle /> WhatsApp
              </a>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-press flex items-center justify-center gap-2 bg-terracotta text-white font-semibold rounded-full py-3.5"
            >
              <FiNavigation /> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
