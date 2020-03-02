/**
 * fish catch controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const FishCatch = require('../models/fishCatchModel')

const fishCatchController = {}

fishCatchController.index = async (req, res, next) => {
  try {
    console.log('FISH CONTROLLER CALLED')
    const data = {
      fishCatches: (await FishCatch.find({}))
    }
    res.json({ message: data })
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
