import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiStar } from 'react-icons/fi'
import VerifiedBadge from './VerifiedBadge.jsx'

export default function BusinessCard({ business }) {
  return (
    <Link
      to={`/business/${business.id}`}
      className="group bg-card rounded-xl2 overflow-hidden shadow-card hover:shadow-lift transition-shadow duration-200 flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={business.cover}
          alt={business.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {business.verified && <VerifiedBadge />}
        </div>
        <span
          className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
            ${business.openNow ? 'bg-primary text-white' : 'bg-ink/70 text-white'}`}
        >
          {business.openNow ? 'Open now' : 'Closed'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-lg leading-tight text-ink">
            {business.name}
          </h3>
          <span className="flex items-center gap-1 text-accent-dark font-bold text-sm shrink-0">
            <FiStar className="fill-accent text-accent" /> {business.rating}
          </span>
        </div>
        <p className="text-sm text-ink/60">{business.category}</p>
        <div className="mt-auto flex items-center gap-1.5 text-sm text-ink/70 pt-2 border-t border-line">
          <FiMapPin className="text-primary shrink-0" />
          <span>{business.village} · {business.distanceMins} min away</span>
        </div>
      </div>
    </Link>
  )
}
