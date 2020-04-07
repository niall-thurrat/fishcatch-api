/**
 * User model
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validate = require('../lib/userValidation')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    maxlength: 12
  },
  emailAddress: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: false,
    minlength: 8
  }
}, { timestamps: true })

userSchema.path('password').validate(function (input) {
  return validate.isGoodPassword(input) && validate.isLongEnoughPassword(input)
})

// using pre-hook to salt and hash password
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password') || user.isNew) {
    const salt = await bcrypt.genSalt(10)
    const hashPwd = await bcrypt.hash(user.password, salt)
    user.password = hashPwd
  }
  next()
})

// Compare hashed login password with database password
userSchema.methods.comparePassword = function (loginPassword) {
  return bcrypt.compare(loginPassword, this.password)
}

userSchema.path('username').validate(function (input) {
  return validate.isAlphaNumericOnly(input) &&
    validate.isCorrectLengthUsername(input)
})

userSchema.path('name').validate(function (input) {
  return validate.isSafe(input)
}, "You Cannot use the '$' Character")

userSchema.path('emailAddress').validate(function (input) {
  return validate.isSafe(input)
}, "You Cannot use the '$' Character")

const User = mongoose.model('User', userSchema)

// Exports
module.exports = User
