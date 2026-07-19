import React, { useState } from 'react'
import { FiX, FiMapPin, FiCrosshair, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { villages } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'

export default function LocationModal({ open, onClose }) {
  const { setVillage } = useApp()
  const [query, setQuery] = useState('')

  if (!open) return null

  const filtered = villages.filter((v) => v.toLowerCase().includes(query.toLowerCase()))

  const pick = (name) => {
    setVillage(name)
    toast.success(`Showing businesses near ${name}`)
    onClose()
  }

  const useCurrentLocation = () => {
    toast.success('Using your current location')
    setVillage('Your Location')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-lift p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Choose your location</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-line/60 text-ink/70"
          >
            <FiX size={20} />
          </button>
        </div>

        <button
          onClick={useCurrentLocation}
          className="btn-press w-full flex items-center gap-3 bg-primary text-white rounded-xl px-4 py-3.5 font-semibold mb-4"
        >
          <FiCrosshair size={20} />
          Use my current location
        </button>

        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your village or town"
            className="w-full border border-line rounded-xl pl-10 pr-4 py-3 bg-white focus:border-primary outline-none"
          />
        </div>

        <p className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-2">Popular villages</p>
        <div className="flex flex-col gap-1">
          {filtered.map((v) => (
            <button
              key={v}
              onClick={() => pick(v)}
              className="flex items-center gap-3 text-left px-3 py-3 rounded-xl hover:bg-white transition-colors"
            >
              <FiMapPin className="text-terracotta shrink-0" />
              <span className="font-medium">{v}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-ink/50 px-3 py-4">No village found. Try a different spelling.</p>
          )}
        </div>
      </div>
    </div>
  )
}
