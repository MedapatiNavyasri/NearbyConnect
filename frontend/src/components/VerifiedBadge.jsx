import React from 'react'

export default function VerifiedBadge({ size = 'sm' }) {
  const isSm = size === 'sm'
  return (
    <span
      className={`verified-stamp stamp-ring text-primary bg-white/90 backdrop-blur-sm rounded-full font-body font-bold uppercase tracking-wide
        ${isSm ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1.5'}`}
    >
      <span aria-hidden="true">✓</span> Verified
    </span>
  )
}
