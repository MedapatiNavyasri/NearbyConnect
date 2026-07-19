import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <span className="font-display text-2xl font-bold text-white">Nearby<span className="text-accent">Connect</span></span>
          <p className="mt-3 text-sm leading-relaxed">
            Helping villages and small towns discover and support the businesses next door.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-white">Browse Shops</Link></li>
            <li><Link to="/register-shop-benefits" className="hover:text-white">Register Your Business</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>Grocery</li>
            <li>Medical</li>
            <li>Restaurants</li>
            <li>Fashion</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FiMapPin /> Andhra Pradesh, India</li>
            <li className="flex items-center gap-2"><FiPhone /> +91 90000 00000</li>
            <li className="flex items-center gap-2"><FiMail /> hello@nearbyconnect.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} NearbyConnect. Made for local businesses everywhere.
      </div>
    </footer>
  )
}
