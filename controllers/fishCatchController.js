/**
 * fish catch controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const FishCatch = require('../models/fishCatchModel')

const fishCatchController = {}

// GET /fish endpoint
fishCatchController.index = async (req, res, next) => {
  try {
    const data = await FishCatch.find({})

    res.json({ fishCatches: data })
  } catch (error) {
    next(error)
  }
}

// POST /fish endpoint
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

// GET /fish/:fishId endpoint
fishCatchController.viewFish = async (req, res, next) => {
  try {
    const data = await FishCatch.findById(req.params.fishId)

    res.json(data) // status?
  } catch (error) {
    next(error)
  }
}

// PUT /fish/:fishId endpoint
fishCatchController.updateFish = async (req, res, next) => {
  try {
    await FishCatch.findOneAndUpdate({ _id: req.params.fishId }, {
      test: req.body.test
    })

    res.status(200).send('null') // 204 no content should be used
  } catch (error) {
    next(error)
  }
}

// DELETE /fish/:fishId endpoint
fishCatchController.deleteFish = async (req, res, next) => {
  try {
    await FishCatch.remove({ _id: req.params.fishId })

    res.status(200).send('null') // change status //
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
