/**
 * Mongoose model of a fish catch.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')

// Create a fish catch schema.
const fishCatchSchema = new mongoose.Schema({
  catcherName: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true
  }
}, { timestamps: true })

// Create a model using the schema.
const FishCatch = mongoose.model('fishCatch', fishCatchSchema)

// Exports.
module.exports = FishCatch

// FISH DATA FOR MODEL
/*
  catchLatitude: {
    type: Number,
    required: true
  },
  catchLongitude: {
    type: Number,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  }
*/
