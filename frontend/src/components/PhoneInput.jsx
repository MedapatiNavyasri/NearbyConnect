import React from 'react'

// value/onChange work with the 10-digit number only.
// The parent is responsible for prefixing "+91" when saving/submitting.
export default function PhoneInput({ value, onChange, placeholder = 'Mobile number' }) {
  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(digitsOnly)
  }

  return (
    <div className="flex border border-line rounded-xl overflow-hidden focus-within:border-primary">
      <span className="flex items-center px-3.5 bg-paper text-ink/60 font-semibold text-sm border-r border-line select-none">
        +91
      </span>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        inputMode="numeric"
        maxLength={10}
        className="flex-1 px-4 py-3.5 outline-none min-w-0"
      />
    </div>
  )
}
