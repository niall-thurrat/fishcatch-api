/**
 * fish catch controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const FishCatch = require('../models/fishCatchModel')
// const passport = require('passport')

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
      catcherName: req.user.username,
      weight: req.body.weight
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
    const fishCatch = await FishCatch.findOne({ _id: req.params.fishId })

    if (fishCatch.catcherName === req.user.username) {
      await fishCatch.updateOne({ weight: req.body.weight })
    } else {
      const error = 'Not authorized to edit this fish'
      return res.status(403).json(error)
    }

    res.status(200).send('null')
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
