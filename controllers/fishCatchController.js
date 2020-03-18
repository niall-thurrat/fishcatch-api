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
fishCatchController.viewAllFish = async (req, res, next) => {
  try {
    const fishCatches = await FishCatch.find({})

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resource = halson({
      // all_fish: data, embed
      total_fish_in_collection: fishCatches.length,
      description: 'Collection of all fish. Direct users to view a single ' +
        'fish, their own fish collection or their own user resource.'
    }).addLink('self', '/fish')
      .addLink('next', '/fish?page=2')
      .addLink('curies', [{
        name: 'fc',
        href: `https://${req.headers.host}/docs/rels/{rel}`,
        templated: true
      }])
      .addLink('fc:user', `/users/${req.user.username}`)
      .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
      .addLink('fc:one-fish', {
        href: '/fish/{fishId}',
        templated: true
      })

    res.send(JSON.stringify(resource))
  } catch (error) {
    next(error)
  }
}

// POST /fish endpoint
fishCatchController.addFish = (req, res, next) => {
  try {
    const fishCatch = new FishCatch({
      catcherName: req.user.name,
      catchLatitude: req.body.catchLatitude,
      catchLongitude: req.body.catchLongitude,
      species: req.body.species,
      weight: req.body.weight,
      length: req.body.length
    })

    fishCatch.save((err, fish) => {
      if (err) throw err

      res.status(201)
      res.setHeader('Content-Type', 'application/hal+json')
      res.setHeader('Location', `https://${req.headers.host}/fish/${fish._id}`)

      const resource = halson({
        fish_catch: fish,
        fish_catcher: req.user,
        description: 'Fish resouce has been added and will show in both fish ' +
        'and user-fish collections. User can be directed to the new fish resource ' +
        'or back to where the fish is added from: a fish collection or the user resource'
      }).addLink('self', `/fish/${fish._id}`)
        .addLink('curies', [{
          name: 'fc',
          href: `https://${req.headers.host}/docs/rels/{rel}`,
          templated: true
        }])
        .addLink('fc:fish', '/fish')
        .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
        .addLink('fc:user', `/users/${req.user.username}`)

      res.send(JSON.stringify(resource))
    })
  } catch (error) {
    next(error)
  }
}

// GET /fish/:fishId endpoint
fishCatchController.viewFish = (req, res, next) => {
  try {
    FishCatch.findById(req.params.fishId, (err, fish) => {
      if (err) throw err

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')

      const resource = halson({
        fish_catch: fish,
        fish_catcher: req.user,
        description: 'Fish resouce has been retrieved'
      }).addLink('self', `/fish/${fish._id}`)
        .addLink('curies', [{
          name: 'fc',
          href: `https://${req.headers.host}/docs/rels/{rel}`,
          templated: true
        }])
        .addLink('fc:fish', '/fish')
        .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
        .addLink('fc:user', `/users/${req.user.username}`)

      res.send(JSON.stringify(resource))
    })
  } catch (error) {
    next(error)
  }
}

// PUT /fish/:fishId endpoint
fishCatchController.updateFish = (req, res, next) => {
  try {
    const newFish = {
      catchLatitude: req.body.catchLatitude,
      catchLongitude: req.body.catchLongitude,
      species: req.body.species,
      weight: req.body.weight,
      length: req.body.length
    }

    for (const key in newFish) {
      if (newFish[key] === undefined) {
        delete newFish[key]
      }
    }

    FishCatch.findOneAndUpdate({ _id: req.params.fishId }, { $set: newFish },
      { upsert: true, new: true }, (err, fish) => {
        if (err) throw err

        res.status(200)
        res.setHeader('Content-Type', 'application/hal+json')

        const resource = halson({
          fish_catch: fish,
          fish_catcher: req.user,
          description: 'Fish resource updated'
        }).addLink('self', `/fish/${fish._id}`)
          .addLink('curies', [{
            name: 'fc',
            href: `https://${req.headers.host}/docs/rels/{rel}`,
            templated: true
          }])
          .addLink('fc:fish', '/fish')
          .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
          .addLink('fc:user', `/users/${req.user.username}`)

        res.send(JSON.stringify(resource))
      })
  } catch (error) {
    next(error)
  }
}

// DELETE /fish/:fishId endpoint
fishCatchController.deleteFish = (req, res, next) => {
  try {
    FishCatch.deleteOne({ _id: req.params.fishId }, (err, fish) => {
      if (err) throw err

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')

      const resource = halson({
        logged_on_user: req.user,
        description: 'Fish resource deleted. Can direct user to where the fish ' +
        'was accessed from: the fish or user-fish collection, or the user resource'
      }).addLink('curies', [{
        name: 'fc',
        href: `https://${req.headers.host}/docs/rels/{rel}`,
        templated: true
      }])
        .addLink('fc:fish', '/fish')
        .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
        .addLink('fc:user', `/users/${req.user.username}`)

      res.send(JSON.stringify(resource))
    })
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = fishCatchController
