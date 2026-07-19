import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMail, FiLock } from 'react-icons/fi'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in both fields')
      return
    }
    setSubmitting(true)
    try {
      const userData = await login(email, password)
      toast.success(`Welcome back, ${userData.name}!`)
      if (userData.role === 'admin') navigate('/admin/dashboard')
      else if (userData.role === 'owner') navigate('/owner/dashboard')
      else navigate('/customer/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-line rounded-xl2 p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-center mb-1">Welcome back</h1>
        <p className="text-center text-ink/60 mb-6">Login to continue to NearbyConnect</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border border-line rounded-xl pl-11 pr-4 py-3.5 focus:border-primary outline-none"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-line rounded-xl pl-11 pr-4 py-3.5 focus:border-primary outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-press bg-primary text-white font-semibold rounded-full py-3.5 mt-2 hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          New to NearbyConnect?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
        </p>
        <p className="text-center text-xs text-ink/40 mt-3">
          <Link to="/admin/login" className="hover:underline">Admin login</Link>
        </p>
      </div>
    </div>
  )
}
