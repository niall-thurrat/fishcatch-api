const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
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
})

const User = mongoose.model('User', userSchema)

module.exports = User
