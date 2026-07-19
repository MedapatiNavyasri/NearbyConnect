import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext.jsx'
import PhoneInput from '../components/PhoneInput.jsx'
import { isValidEmail, isValidIndianMobile, passwordsMatch } from '../utils/validators.js'

export default function RegisterCustomer() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
  const [submitting, setSubmitting] = useState(false)
  const { registerCustomer } = useApp()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.mobile || !form.password || !form.confirmPassword) {
      toast.error('Please fill in every field')
      return
    }
    if (!isValidEmail(form.email)) {
      toast.error('Please enter a valid email address (e.g. name@gmail.com)')
      return
    }
    if (!isValidIndianMobile(form.mobile)) {
      toast.error('Please enter a valid 10-digit Indian mobile number')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (!passwordsMatch(form.password, form.confirmPassword)) {
      toast.error('Passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      await registerCustomer({
        name: form.name,
        email: form.email,
        mobile: `+91${form.mobile}`,
        password: form.password,
      })
      toast.success('Account created — welcome to NearbyConnect!')
      navigate('/customer/dashboard')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-line rounded-xl2 p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-center mb-1">Create your account</h1>
        <p className="text-center text-ink/60 mb-6">Save favorites, write reviews, and more</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={form.name} onChange={update('name')} placeholder="Full name"
            className="w-full border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none"
          />
          <input
            value={form.email} onChange={update('email')} type="email" placeholder="Email address (e.g. name@gmail.com)"
            className="w-full border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none"
          />
          <PhoneInput value={form.mobile} onChange={(v) => setForm((f) => ({ ...f, mobile: v }))} />
          <input
            value={form.password} onChange={update('password')} type="password" placeholder="Create a password (min. 6 characters)"
            className="w-full border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none"
          />
          <input
            value={form.confirmPassword} onChange={update('confirmPassword')} type="password" placeholder="Confirm password"
            className="w-full border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-press bg-primary text-white font-semibold rounded-full py-3.5 mt-2 hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
