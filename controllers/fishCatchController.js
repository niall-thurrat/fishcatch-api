/**
 * fish catch controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

// const FishCatch = require('../models/fishCatchModel')

const fishCatchController = {}

fishCatchController.index = async (req, res, next) => {
  try {
    console.log('FISH CONTROLLER WORKING!!!')
    res.json({ message: 'this is where i guess i\'ll do databasy stuff!!!' })
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
