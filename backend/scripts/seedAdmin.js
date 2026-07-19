// Run once to create your first admin account:
//   node scripts/seedAdmin.js admin@nearbyconnect.in yourStrongPassword "Admin Name"
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

async function run() {
  const [, , email, password, name = 'Admin'] = process.argv

  if (!email || !password) {
    console.log('Usage: node scripts/seedAdmin.js <email> <password> [name]')
    process.exit(1)
  }

  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    console.log(`A user with email ${email} already exists (role: ${existing.role}).`)
    if (existing.role !== 'admin') {
      existing.role = 'admin'
      await existing.save()
      console.log('Updated that user\'s role to admin.')
    }
    process.exit(0)
  }

  const hashed = await bcrypt.hash(password, 10)
  await User.create({ name, email, password: hashed, role: 'admin' })
  console.log(`Admin account created: ${email}`)
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
