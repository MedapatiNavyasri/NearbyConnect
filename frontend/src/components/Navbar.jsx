import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMapPin, FiMenu, FiX } from 'react-icons/fi'
import { useApp } from '../context/AppContext.jsx'
import LocationModal from './LocationModal.jsx'

export default function Navbar() {
  const { village, user, logout } = useApp()
  const [locationOpen, setLocationOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-semibold text-sm transition-colors ${isActive ? 'text-primary' : 'text-ink/70 hover:text-ink'}`

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl font-bold text-primary">Nearby<span className="text-terracotta">Connect</span></span>
          </Link>

          <button
            onClick={() => setLocationOpen(true)}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-ink/80 bg-white border border-line rounded-full px-4 py-2 hover:border-primary transition-colors"
          >
            <FiMapPin className="text-terracotta" />
            {village ? village : 'Choose location'}
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/explore" className={linkClass}>Browse Shops</NavLink>
            <NavLink to="/register-shop-benefits" className={linkClass}>Register Shop</NavLink>
            {user ? (
              <>
                <NavLink
                  to={user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'}
                  className={linkClass}
                >
                  Dashboard
                </NavLink>
                <button onClick={logout} className="btn-press bg-ink text-white text-sm font-semibold rounded-full px-5 py-2.5">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-press bg-primary text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-primary-dark">
                Login
              </Link>
            )}
          </nav>

          <button className="md:hidden p-2 text-ink" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-line bg-paper px-4 py-4 flex flex-col gap-3">
            <button
              onClick={() => { setLocationOpen(true); setMenuOpen(false) }}
              className="flex items-center gap-1.5 text-sm font-semibold bg-white border border-line rounded-full px-4 py-2.5 w-fit"
            >
              <FiMapPin className="text-terracotta" /> {village ? village : 'Choose location'}
            </button>
            <NavLink to="/explore" onClick={() => setMenuOpen(false)} className="font-semibold py-1.5">Browse Shops</NavLink>
            <NavLink to="/register-shop-benefits" onClick={() => setMenuOpen(false)} className="font-semibold py-1.5">Register Shop</NavLink>
            {user ? (
              <>
                <NavLink
                  to={user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'}
                  onClick={() => setMenuOpen(false)}
                  className="font-semibold py-1.5"
                >
                  Dashboard
                </NavLink>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="btn-press bg-ink text-white text-sm font-semibold rounded-full px-5 py-3 mt-1">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-press bg-primary text-white text-sm font-semibold rounded-full px-5 py-3 mt-1 text-center">
                Login
              </Link>
            )}
          </div>
        )}
      </header>

      <LocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />
    </>
  )
}
