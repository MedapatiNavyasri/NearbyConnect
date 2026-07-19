// Basic but solid email check — accepts personal (gmail, yahoo, etc.)
// and business domains alike, just enforces a real email shape.
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim())
}

// Indian mobile numbers: 10 digits, starting with 6-9 (as per TRAI numbering).
// We store the number WITH the +91 prefix, but validate only the 10-digit part.
export function isValidIndianMobile(tenDigits) {
  return /^[6-9]\d{9}$/.test(tenDigits.trim())
}

export function passwordsMatch(password, confirmPassword) {
  return password.length > 0 && password === confirmPassword
}
