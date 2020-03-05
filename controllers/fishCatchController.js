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

fishCatchController.addFish = async (req, res, next) => {
  try {
    const fishCatch = new FishCatch({
      test: req.body.test
    })

    await fishCatch.save()

    res.status(201).send('null')
  } catch (error) {
    next(error)
  }
}

fishCatchController.updateFish = async (req, res, next) => {
  try {
    await FishCatch.updateOne({ _id: req.body.id }, {
      test: req.body.test
    })

    res.status(200).send('null') // 204 no content should be used
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController