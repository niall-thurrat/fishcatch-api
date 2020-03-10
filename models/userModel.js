/**
 * User model
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: false
  }
}, { timestamps: true })

// using pre-hook to hash password
userSchema.pre('save', async function (next) {
  const user = this
  const hash = await bcrypt.hash(user.password, 10)
  user.password = hash
  next()
})

// Compare hashed login password with database password
userSchema.methods.isValidPassword = async function (password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)
  return compare
}

const User = mongoose.model('User', userSchema)

module.exports = User
