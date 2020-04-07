/**
 * Hook model
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const mongoose = require('mongoose')

const hookSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  key: {
    type: String,
    required: true
  }
}, { timestamps: true })

const Hook = mongoose.model('hook', hookSchema)

module.exports = Hook
