import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

function sanitize(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

export async function registerCustomer(req, res, next) {
  try {
    const { name, email, mobile, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, mobile, password: hashed, role: 'customer' })
    const token = signToken(user)
    res.status(201).json({ token, user: sanitize(user) })
  } catch (err) {
    next(err)
  }
}

export async function registerOwner(req, res, next) {
  try {
    const { name, email, mobile, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, mobile, password: hashed, role: 'owner' })
    const token = signToken(user)
    res.status(201).json({ token, user: sanitize(user) })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })

    const token = signToken(user)
    res.json({ token, user: sanitize(user) })
  } catch (err) {
    next(err)
  }
}
