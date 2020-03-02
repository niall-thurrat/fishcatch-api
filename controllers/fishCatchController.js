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
    const data = await FishCatch.find({})

    res.json({ fishCatches: data })
  } catch (error) {
    next(error)
  }
}

fishCatchController.add = async (req, res, next) => {
  try {
    const fishCatch = new FishCatch({
      test: req.body.test
    })

    var testy = req.body.test.toString()
    console.log(req.body.test)
    console.log(testy)

    await fishCatch.save()

    res.json({ message: 'woohoo' })
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
