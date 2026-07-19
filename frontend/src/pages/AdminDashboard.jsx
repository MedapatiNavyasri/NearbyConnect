import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiGrid, FiClock, FiUsers, FiTag, FiFlag, FiCheck, FiX } from 'react-icons/fi'
import * as miscApi from '../api/misc.js'
import { useApp } from '../context/AppContext.jsx'

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { id: 'pending', label: 'Pending Businesses', icon: <FiClock /> },
  { id: 'users', label: 'Users', icon: <FiUsers /> },
  { id: 'categories', label: 'Categories', icon: <FiTag /> },
  { id: 'reports', label: 'Reports', icon: <FiFlag /> },
]

export default function AdminDashboard() {
  const { user, logout } = useApp()
  const [section, setSection] = useState('dashboard')
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPending = () => {
    setLoading(true)
    miscApi
      .getPendingShops()
      .then((shops) => setPending(shops))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (user?.role === 'admin') loadPending()
  }, [user])

  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />

  const decide = async (id, approved) => {
    try {
      if (approved) {
        await miscApi.approveShop(id)
      } else {
        await miscApi.rejectShop(id)
      }
      setPending((p) => p.filter((x) => x._id !== id))
      toast.success(approved ? 'Business approved and now live' : 'Business rejected')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="bg-white border border-line rounded-xl2 p-3 h-fit md:sticky md:top-24">
        <div className="px-3 py-3 mb-1">
          <p className="font-display font-semibold">Admin Panel</p>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={`flex items-center gap-2.5 text-sm font-semibold rounded-xl px-3.5 py-2.5 whitespace-nowrap text-left
                ${section === n.id ? 'bg-ink text-white' : 'text-ink/70 hover:bg-paper'}`}
            >
              {n.icon} {n.label}
            </button>
          ))}
          <button onClick={logout} className="flex items-center gap-2.5 text-sm font-semibold rounded-xl px-3.5 py-2.5 text-terracotta hover:bg-paper whitespace-nowrap">
            Logout
          </button>
        </nav>
      </aside>

      <div>
        {section === 'dashboard' && (
          <div>
            <h1 className="font-display text-2xl font-semibold mb-6">Platform Overview</h1>
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
              {[
                { label: 'Pending Approval', value: pending.length },
                { label: 'Categories', value: 8 },
              ].map((c) => (
                <div key={c.label} className="bg-white border border-line rounded-xl2 p-5 shadow-card">
                  <p className="font-display text-2xl font-semibold text-ink">{c.value}</p>
                  <p className="text-xs text-ink/50 mt-1">{c.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink/40 mt-4">
              Total businesses and total users counts need a dedicated stats endpoint — ask me to add one when you're ready.
            </p>
          </div>
        )}

        {section === 'pending' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Pending Businesses</h2>
              <button onClick={loadPending} className="text-sm font-semibold text-primary hover:underline">
                Refresh
              </button>
            </div>
            {loading ? (
              <p className="text-ink/50">Loading pending businesses...</p>
            ) : pending.length > 0 ? (
              <div className="flex flex-col gap-3">
                {pending.map((p) => (
                  <div key={p._id} className="bg-white border border-line rounded-xl2 p-5 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-semibold">{p.shopName}</p>
                      <p className="text-sm text-ink/50">{p.category} · {p.village}</p>
                      {p.owner?.name && (
                        <p className="text-xs text-ink/40 mt-0.5">Owner: {p.owner.name} · {p.owner.mobile}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => decide(p._id, true)} className="btn-press flex items-center gap-1.5 bg-primary text-white font-semibold rounded-full px-4 py-2 text-sm">
                        <FiCheck /> Approve
                      </button>
                      <button onClick={() => decide(p._id, false)} className="btn-press flex items-center gap-1.5 bg-white border border-line text-terracotta font-semibold rounded-full px-4 py-2 text-sm">
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-line rounded-xl2 p-12 text-center text-ink/60">
                All caught up — no pending businesses.
              </div>
            )}
          </div>
        )}

        {section === 'users' && (
          <div className="bg-white border border-line rounded-xl2 p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Users</h2>
            <p className="text-ink/60 text-sm">Manage customer and shop owner accounts here.</p>
          </div>
        )}

        {section === 'categories' && (
          <div className="bg-white border border-line rounded-xl2 p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Categories</h2>
            <p className="text-ink/60 text-sm">Add, edit, or remove business categories.</p>
          </div>
        )}

        {section === 'reports' && (
          <div className="bg-white border border-line rounded-xl2 p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Reports</h2>
            <p className="text-ink/60 text-sm">Flagged businesses and reviews appear here for moderation.</p>
          </div>
        )}
      </div>
    </div>
  )
}
