import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiSearch, FiPhoneCall, FiShield, FiZap, FiNavigation } from 'react-icons/fi'
import { categories, stats } from '../data/mockData.js'
import BusinessCard from '../components/BusinessCard.jsx'
import LocationModal from '../components/LocationModal.jsx'
import { useApp } from '../context/AppContext.jsx'
import * as shopsApi from '../api/shops.js'
import { normalizeShop } from '../utils/normalizeShop.js'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function Home() {
  const { village } = useApp()
  const [locationOpen, setLocationOpen] = useState(false)
  const [recentShops, setRecentShops] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    shopsApi
      .getShops()
      .then((data) => setRecentShops(data.slice(0, 6).map(normalizeShop)))
      .catch(() => setRecentShops([]))
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-20 md:pt-20 md:pb-28 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-white border border-line rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            Now live across 25+ villages
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] max-w-3xl mx-auto"
          >
            Discover Trusted <span className="text-primary">Local Businesses</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 text-lg text-ink/70 max-w-2xl mx-auto"
          >
            Find verified grocery stores, restaurants, medical shops, hardware stores, fashion
            stores, and more — right around your location.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto"
          >
            <button
              onClick={() => setLocationOpen(true)}
              className="btn-press flex items-center justify-center gap-2 bg-white border-2 border-line rounded-full px-5 py-3.5 font-semibold text-ink/80 hover:border-primary"
            >
              <FiMapPin className="text-terracotta shrink-0" />
              {village ? village : 'Choose your location'}
            </button>
            <Link
              to="/explore"
              className="btn-press flex items-center justify-center gap-2 bg-primary text-white rounded-full px-6 py-3.5 font-semibold shadow-soft hover:bg-primary-dark"
            >
              <FiSearch /> Browse Shops
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-4"
          >
            <Link to="/register-shop-benefits" className="text-sm font-semibold text-terracotta hover:underline underline-offset-4">
              Own a business? Register it free →
            </Link>
          </motion.div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/explore?category=${c.id}`)}
                className="btn-press bg-white border border-line rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-1.5 hover:border-accent"
              >
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="font-display text-3xl md:text-4xl font-semibold text-accent">{s.value}</p>
              <p className="text-sm text-white/75 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-semibold">What are you looking for?</h2>
          <p className="text-ink/60 mt-2">Pick a category to see nearby verified businesses.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => navigate(`/explore?category=${c.id}`)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="btn-press bg-card rounded-xl2 p-6 flex flex-col items-center gap-2 shadow-card hover:shadow-lift hover:-translate-y-0.5 transition-all"
            >
              <span className="text-4xl">{c.icon}</span>
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-ink/50">{c.count} shops</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* WHY NEARBYCONNECT */}
      <section className="bg-white border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold">Why NearbyConnect</h2>
            <p className="text-ink/60 mt-2">Built for how villages and small towns actually shop.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FiShield />, title: 'Verified Businesses', text: 'Every business is checked by our team before it goes live.' },
              { icon: <FiSearch />, title: 'Easy Discovery', text: 'Search by category or village — no confusing menus.' },
              { icon: <FiPhoneCall />, title: 'Instant Contact', text: 'Call or WhatsApp a shop directly, no middleman.' },
              { icon: <FiNavigation />, title: 'Location Based', text: 'See only businesses near where you actually are.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center sm:text-left"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent-dark flex items-center justify-center text-xl mb-4 mx-auto sm:mx-0">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <p className="text-ink/60 mt-2">Three simple steps, no sign-up needed to browse.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            { step: '1', title: 'Choose Location', text: 'Tell us your village or let us find you automatically.' },
            { step: '2', title: 'Explore Businesses', text: 'Browse by category and see who is open right now.' },
            { step: '3', title: 'Connect Instantly', text: 'Call, message on WhatsApp, or get walking directions.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl2 p-8 shadow-card text-center relative"
            >
              <div className="w-14 h-14 rounded-full bg-primary text-white font-display text-2xl font-semibold flex items-center justify-center mx-auto mb-5">
                {s.step}
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENTLY VERIFIED */}
      <section className="bg-white border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
            <div>
              <h2 className="font-display text-3xl font-semibold">Recently Verified Businesses</h2>
              <p className="text-ink/60 mt-2">Fresh faces on NearbyConnect, checked and approved.</p>
            </div>
            <Link to="/explore" className="font-semibold text-primary hover:underline underline-offset-4 shrink-0">
              View all →
            </Link>
          </div>
          {recentShops.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentShops.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          ) : (
            <div className="bg-paper border border-line rounded-xl2 p-10 text-center text-ink/50">
              No verified businesses yet — be the first to register one below.
            </div>
          )}
        </div>
      </section>

      {/* BECOME A VERIFIED BUSINESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-primary rounded-xl2 overflow-hidden relative px-6 sm:px-14 py-14 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-xl mx-auto">
            Become a Verified Business
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-white/90 max-w-2xl mx-auto">
            {['Reach Nearby Customers', 'Get Verified Badge', 'Receive Reviews', 'Share Offers', 'Increase Visibility'].map((b) => (
              <span key={b} className="flex items-center gap-1.5">
                <span className="text-accent">✓</span> {b}
              </span>
            ))}
          </div>
          <Link
            to="/register-shop-benefits"
            className="btn-press inline-block mt-9 bg-accent text-ink font-bold rounded-full px-8 py-3.5 hover:bg-accent-dark hover:text-white transition-colors"
          >
            Register Your Business
          </Link>
        </div>
      </section>

      <LocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />
    </div>
  )
}
