import React from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiShield, FiStar, FiTag, FiTrendingUp } from 'react-icons/fi'

const benefits = [
  { icon: <FiUsers />, title: 'Reach Nearby Customers', text: 'Get discovered by everyone searching your category in your village.' },
  { icon: <FiShield />, title: 'Get Verified Badge', text: 'Stand out with a trust badge once our team confirms your business.' },
  { icon: <FiStar />, title: 'Receive Reviews', text: 'Build a public reputation with ratings from real customers.' },
  { icon: <FiTag />, title: 'Share Offers', text: 'Post daily offers and community updates in seconds — no inventory needed.' },
  { icon: <FiTrendingUp />, title: 'Increase Visibility', text: 'Track profile views and know exactly how many people find you.' },
]

export default function RegisterShopBenefits() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <span className="inline-block bg-accent/20 text-accent-dark text-xs font-bold uppercase tracking-wide rounded-full px-4 py-1.5 mb-4">
          Free to join
        </span>
        <h1 className="font-display text-4xl font-semibold">Grow your business with NearbyConnect</h1>
        <p className="text-ink/60 mt-3 max-w-xl mx-auto">
          No product uploads, no inventory management — just tell customers who you are, and let them reach you directly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
        {benefits.map((b) => (
          <div key={b.title} className="bg-white border border-line rounded-xl2 p-6 shadow-card">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg mb-4">
              {b.icon}
            </div>
            <h3 className="font-display font-semibold text-lg mb-1.5">{b.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-xl2 px-6 sm:px-14 py-12 text-center text-white">
        <h2 className="font-display text-2xl font-semibold mb-2">Ready to get listed?</h2>
        <p className="text-white/80 mb-7">Registration takes about 5 minutes. Our team verifies your business within 24 hours.</p>
        <Link
          to="/register-shop"
          className="btn-press inline-block bg-accent text-ink font-bold rounded-full px-8 py-3.5 hover:bg-accent-dark hover:text-white transition-colors"
        >
          Register Your Business
        </Link>
      </div>
    </div>
  )
}
