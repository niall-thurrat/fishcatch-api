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
      catcherName: req.user.name,
      catchLatitude: req.body.catchLatitude,
      catchLongitude: req.body.catchLongitude,
      species: req.body.species,
      weight: req.body.weight,
      length: req.body.length
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

    if (fishCatch.catcherName === req.user.name) {
      await fishCatch.updateOne({
        catchLatitude: req.body.catchLatitude,
        catchLongitude: req.body.catchLongitude,
        species: req.body.species,
        weight: req.body.weight,
        length: req.body.length
      })
    } else {
      return res.status(403).json('Not authorized to edit this fish')
    }

    res.status(200).send('null')
  } catch (error) {
    next(error)
  }
}

// DELETE /fish/:fishId endpoint
fishCatchController.deleteFish = async (req, res, next) => {
  try {
    const fishCatch = await FishCatch.findOne({ _id: req.params.fishId })

    if (!fishCatch) {
      return res.status(404).send('resource does not exist')
    } else {
      if (fishCatch.catcherName === req.user.name) {
        await FishCatch.deleteOne({ _id: req.params.fishId })

        res.status(204).send('null')
      } else {
        res.status(403).json('Not authorized to delete this fish')
      }
    }
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
