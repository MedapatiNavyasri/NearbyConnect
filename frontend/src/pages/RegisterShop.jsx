import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCheck, FiUpload } from 'react-icons/fi'
import { categories, villages } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import PhoneInput from '../components/PhoneInput.jsx'
import { isValidEmail, isValidIndianMobile, passwordsMatch } from '../utils/validators.js'
import * as shopsApi from '../api/shops.js'
import * as miscApi from '../api/misc.js'

const steps = ['Owner Details', 'Business Details', 'Services & Photos']

const serviceSuggestions = {
  medical: ['Prescription', 'OTC Medicines', 'Baby Care'],
  restaurant: ['Dining', 'Takeaway', 'Home Delivery'],
  grocery: ['Daily Essentials', 'Dairy', 'Snacks'],
}

export default function RegisterShop() {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    ownerName: '', ownerEmail: '', ownerPassword: '', ownerConfirmPassword: '', ownerMobile: '',
    businessName: '', category: '', village: '', address: '', phone: '', whatsapp: '',
    description: '', openingHours: '', services: [],
  })
  const [logoFile, setLogoFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  const { registerOwner } = useApp()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const updatePhone = (key) => (v) => setForm((f) => ({ ...f, [key]: v }))

  const toggleService = (s) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }))
  }

  const next = () => {
    if (step === 0) {
      if (!form.ownerName || !form.ownerEmail || !form.ownerMobile || !form.ownerPassword || !form.ownerConfirmPassword) {
        toast.error('Please fill in all owner details')
        return
      }
      if (!isValidEmail(form.ownerEmail)) {
        toast.error('Please enter a valid email address (e.g. name@gmail.com)')
        return
      }
      if (!isValidIndianMobile(form.ownerMobile)) {
        toast.error('Please enter a valid 10-digit Indian mobile number')
        return
      }
      if (form.ownerPassword.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
      if (!passwordsMatch(form.ownerPassword, form.ownerConfirmPassword)) {
        toast.error('Passwords do not match')
        return
      }
    }
    if (step === 1) {
      if (!form.businessName || !form.category || !form.village || !form.address || !form.phone) {
        toast.error('Please fill in all business details')
        return
      }
      if (!isValidIndianMobile(form.phone)) {
        toast.error('Please enter a valid 10-digit Indian phone number')
        return
      }
      if (form.whatsapp && !isValidIndianMobile(form.whatsapp)) {
        toast.error('Please enter a valid 10-digit Indian WhatsApp number')
        return
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // 1. Create the owner account and log them in (this stores the JWT
      //    needed for the authenticated calls that follow).
      await registerOwner({
        name: form.ownerName,
        email: form.ownerEmail,
        mobile: `+91${form.ownerMobile}`,
        password: form.ownerPassword,
      })

      // 2. Upload any selected images to Cloudinary via the backend.
      let logoUrl, coverUrl, galleryUrls = []
      if (logoFile) {
        const res = await miscApi.uploadSingleImage(logoFile)
        logoUrl = res.url
      }
      if (coverFile) {
        const res = await miscApi.uploadSingleImage(coverFile)
        coverUrl = res.url
      }
      if (galleryFiles.length > 0) {
        const res = await miscApi.uploadGalleryImages(galleryFiles)
        galleryUrls = res.urls
      }

      // 3. Create the shop record itself — goes in as "pending" until an admin approves it.
      const categoryName = categories.find((c) => c.id === form.category)?.name || form.category
      await shopsApi.createShop({
        shopName: form.businessName,
        category: categoryName,
        village: form.village,
        address: form.address,
        phone: `+91${form.phone}`,
        whatsapp: form.whatsapp ? `+91${form.whatsapp}` : undefined,
        description: form.description,
        openingHours: form.openingHours,
        services: form.services,
        logo: logoUrl,
        cover: coverUrl,
        gallery: galleryUrls,
      })

      toast.success('Business submitted for verification!')
      navigate('/owner/dashboard')
    } catch (err) {
      toast.error(err.message || 'Something went wrong submitting your business')
    } finally {
      setSubmitting(false)
    }
  }

  const suggestions = serviceSuggestions[form.category] || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-semibold text-center mb-2">Register Your Business</h1>
      <p className="text-center text-ink/60 mb-8">Takes about 5 minutes. No inventory or product uploads needed.</p>

      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm
                  ${i < step ? 'bg-primary text-white' : i === step ? 'bg-accent text-ink' : 'bg-white border border-line text-ink/40'}`}
              >
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span className={`text-[11px] font-semibold hidden sm:block ${i === step ? 'text-ink' : 'text-ink/40'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 w-8 sm:w-16 ${i < step ? 'bg-primary' : 'bg-line'}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-xl2 p-6 sm:p-8 shadow-card">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-semibold text-lg mb-1">Owner information</h2>
            <input value={form.ownerName} onChange={update('ownerName')} placeholder="Your full name" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
            <input value={form.ownerEmail} onChange={update('ownerEmail')} type="email" placeholder="Email address (e.g. name@gmail.com)" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
            <PhoneInput value={form.ownerMobile} onChange={updatePhone('ownerMobile')} />
            <input value={form.ownerPassword} onChange={update('ownerPassword')} type="password" placeholder="Create a password (min. 6 characters)" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
            <input value={form.ownerConfirmPassword} onChange={update('ownerConfirmPassword')} type="password" placeholder="Confirm password" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-semibold text-lg mb-1">Business information</h2>
            <input value={form.businessName} onChange={update('businessName')} placeholder="Business name" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
            <select value={form.category} onChange={update('category')} className="border border-line rounded-xl px-4 py-3.5 bg-white">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={form.village} onChange={update('village')} className="border border-line rounded-xl px-4 py-3.5 bg-white">
              <option value="">Select village</option>
              {villages.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <input value={form.address} onChange={update('address')} placeholder="Full address" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PhoneInput value={form.phone} onChange={updatePhone('phone')} placeholder="Phone number" />
              <PhoneInput value={form.whatsapp} onChange={updatePhone('whatsapp')} placeholder="WhatsApp number" />
            </div>
            <input value={form.openingHours} onChange={update('openingHours')} placeholder="Opening hours (e.g. 9 AM – 9 PM)" className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
            <textarea value={form.description} onChange={update('description')} placeholder="Tell customers about your business" rows={3} className="border border-line rounded-xl px-4 py-3.5 focus:border-primary outline-none" />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-display font-semibold text-lg mb-1">Services & photos</h2>
            <div>
              <p className="text-sm font-semibold mb-2">What do you offer?</p>
              <div className="flex flex-wrap gap-2">
                {(suggestions.length ? suggestions : ['Home Delivery', 'Walk-ins Welcome', 'Cash on Delivery']).map((s) => (
                  <button
                    type="button" key={s} onClick={() => toggleService(s)}
                    className={`text-xs font-semibold rounded-full px-3.5 py-2 border
                      ${form.services.includes(s) ? 'bg-primary text-white border-primary' : 'border-line hover:border-primary'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <label className="border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-2 py-8 text-ink/50 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                <FiUpload size={20} />
                <span className="text-xs font-semibold">{logoFile ? logoFile.name : 'Logo'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0] || null)} />
              </label>
              <label className="border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-2 py-8 text-ink/50 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                <FiUpload size={20} />
                <span className="text-xs font-semibold">{coverFile ? coverFile.name : 'Cover Photo'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0] || null)} />
              </label>
              <label className="border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-2 py-8 text-ink/50 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                <FiUpload size={20} />
                <span className="text-xs font-semibold">{galleryFiles.length ? `${galleryFiles.length} selected` : 'Gallery'}</span>
                <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} />
              </label>
            </div>
            <p className="text-xs text-ink/50">Images help customers recognize your shop — you can add these later too.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button type="button" onClick={back} className="font-semibold text-ink/60 px-5 py-3 hover:text-ink">
              Back
            </button>
          ) : <span />}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-press bg-primary text-white font-semibold rounded-full px-7 py-3 hover:bg-primary-dark">
              Continue
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-press bg-terracotta text-white font-semibold rounded-full px-7 py-3 hover:bg-terracotta-dark disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
