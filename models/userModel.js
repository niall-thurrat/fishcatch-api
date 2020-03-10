/**
 * User model
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const mongoose = require('mongoose')

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

const User = mongoose.model('User', userSchema)

module.exports = User
