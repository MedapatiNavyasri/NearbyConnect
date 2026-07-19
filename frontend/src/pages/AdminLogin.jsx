import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiLock } from 'react-icons/fi'
import { useApp } from '../context/AppContext.jsx'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, logout } = useApp()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Enter admin credentials')
      return
    }
    setSubmitting(true)
    try {
      const userData = await login(email, password)
      if (userData.role !== 'admin') {
        logout()
        toast.error('This account does not have admin access')
        return
      }
      toast.success('Welcome back, admin')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <div className="bg-white border border-line rounded-xl2 p-8 shadow-card">
        <div className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center mx-auto mb-4">
          <FiLock size={20} />
        </div>
        <h1 className="font-display text-xl font-semibold text-center mb-1">Admin Login</h1>
        <p className="text-center text-ink/50 text-sm mb-6">Restricted access</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="border border-line rounded-xl px-4 py-3 focus:border-primary outline-none" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-line rounded-xl px-4 py-3 focus:border-primary outline-none" />
          <button type="submit" disabled={submitting} className="btn-press bg-ink text-white font-semibold rounded-full py-3 mt-2 disabled:opacity-60">
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-xs text-ink/40 mt-5">
          No admin account yet? Run <code className="bg-paper px-1.5 py-0.5 rounded">npm run seed:admin</code> in the backend folder to create one.
        </p>
      </div>
    </div>
  )
}
