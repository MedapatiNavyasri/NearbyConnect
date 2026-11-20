
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

async function run() {
  const [, , email, password, name = 'Admin'] = process.argv

  if (!email || !password) {
    console.log(
      'Usage: node scripts/seedAdmin.js <email> <password> [name]'
    )
    process.exit(1)
  }

  await connectDB()

  const existing = await User.findOne({ email })

  if (existing) {
    // Update existing admin account
    existing.name = name
    existing.password = await bcrypt.hash(password, 10)
    existing.role = 'admin'

    await existing.save()

    console.log('Admin name and password updated successfully!')
  } else {
    // Create a new admin account
    const hashed = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashed,
      role: 'admin'
    })

    console.log(`Admin account created: ${email}`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
