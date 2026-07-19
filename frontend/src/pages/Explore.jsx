import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiSearch, FiMapPin, FiFilter } from 'react-icons/fi'
import { categories, villages } from '../data/mockData.js'
import BusinessCard from '../components/BusinessCard.jsx'
import * as shopsApi from '../api/shops.js'
import { normalizeShop } from '../utils/normalizeShop.js'

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [village, setVillage] = useState('')
  const [openNow, setOpenNow] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  const categoryName = categories.find((c) => c.id === category)?.name || ''

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (query) params.search = query
    if (categoryName) params.category = categoryName
    if (village) params.village = village
    if (minRating) params.minRating = minRating

    shopsApi
      .getShops(params)
      .then((data) => setShops(data.map(normalizeShop)))
      .catch((err) => toast.error(err.message || 'Could not load businesses'))
      .finally(() => setLoading(false))
  }, [query, categoryName, village, minRating])

  const results = openNow ? shops.filter((s) => s.openNow) : shops

  const clearFilters = () => {
    setCategory('')
    setVillage('')
    setOpenNow(false)
    setMinRating(0)
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Explore Businesses</h1>
        <p className="text-ink/60 mt-1">
          {loading ? 'Loading...' : `${results.length} business${results.length !== 1 ? 'es' : ''} found`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a shop, item, or service..."
            className="w-full bg-white border border-line rounded-full pl-12 pr-4 py-3.5 focus:border-primary outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="btn-press flex items-center justify-center gap-2 bg-white border border-line rounded-full px-5 py-3.5 font-semibold sm:hidden"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white border border-line rounded-xl2 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-xs font-semibold text-terracotta hover:underline">
                Clear all
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(category === c.id ? '' : c.id)}
                    className={`text-xs font-semibold rounded-full px-3 py-2 border transition-colors
                      ${category === c.id ? 'bg-primary text-white border-primary' : 'border-line hover:border-primary'}`}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-2 flex items-center gap-1">
                <FiMapPin /> Village
              </p>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2.5 bg-white"
              >
                <option value="">All villages</option>
                {villages.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openNow}
                  onChange={(e) => setOpenNow(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-semibold">Open now</span>
              </label>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">Minimum rating</p>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`text-xs font-semibold rounded-full px-3 py-2 border
                      ${minRating === r ? 'bg-accent border-accent' : 'border-line hover:border-accent'}`}
                  >
                    {r === 0 ? 'Any' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-line rounded-xl2 h-64 animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-line rounded-xl2 p-14 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-display text-xl font-semibold mb-1">No businesses match yet</h3>
              <p className="text-ink/60 mb-5">Try clearing a filter or searching a different word.</p>
              <button onClick={clearFilters} className="btn-press bg-primary text-white font-semibold rounded-full px-6 py-3">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
