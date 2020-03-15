/**
 * fish catch controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const FishCatch = require('../models/fishCatchModel')
const halson = require('halson')

const fishCatchController = {}

// check user authorized to access fish resources
fishCatchController.authz = async (req, res, next) => {
  try {
    const fishCatch = await FishCatch.findById(req.params.fishId)

    if (!fishCatch) {
      return res.status(404).send('Resource not found in database')
    } else {
      if (fishCatch.catcherName === req.user.name) {
        next()
      } else {
        return res.status(403).send('Not authorized to access this resource')
      }
    }
  } catch (error) {
    next(error)
  }
}

// GET /fish endpoint
fishCatchController.index = async (req, res, next) => {
  try {
    const data = await FishCatch.find({})

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resource = halson({
      logged_in_user: req.user,
      all_fish: data,
      instructions: 'collection of all fish. From here user should' +
        ' view a single fish, their own fish collection or their user page'
    }).addLink('self', `https://${req.headers.host}/fish`)
      .addLink('user', `https://${req.headers.host}/users/${req.user.username}`)
    //  .addLink('fish', `https://${req.headers.host}/fish`) /////////////////////////// how is list auto generated??

    res.send(JSON.stringify(resource))
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

    res.status(201).send('Resource Created')
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

    await fishCatch.updateOne({
      catchLatitude: req.body.catchLatitude,
      catchLongitude: req.body.catchLongitude,
      species: req.body.species,
      weight: req.body.weight,
      length: req.body.length
    })

    res.status(200).send('Resource edited successfully')
  } catch (error) {
    next(error)
  }
}

// DELETE /fish/:fishId endpoint
fishCatchController.deleteFish = async (req, res, next) => {
  try {
    await FishCatch.deleteOne({ _id: req.params.fishId })

    res.status(204).send('Resource deleted successfully') // no content means this null doesn't show right?
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
