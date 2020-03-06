/**
 * User model
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a little help from Frank Atukunda for this one:
 *   https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true })

// Hash password before saving user model
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// Generate auth token for user
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

// Search for user by name and password.
userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' })
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' })
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
