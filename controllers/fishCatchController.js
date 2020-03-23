/**
 * fish catch controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const FishCatch = require('../models/fishCatchModel')
const halson = require('halson')
const getQueryInt = require('../utils/getQueryInt')

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
    const offset = getQueryInt(req.query.offset, 2)
    const limit = getQueryInt(req.query.limit, 3) // prevent limit exceding a certain amount

    const count = await FishCatch.count({})
    const fishCatches = await FishCatch.find({}).sort('-date').skip(offset).limit(limit)

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resource = halson({
      showing_fish_from: offset > count ? 0 : offset,
      to: offset > count ? 0 : (offset + fishCatches.length),
      of_total_fish: count === 0 ? 'no fish' : count,
      description: 'Collection of all fish. Direct users to view a single ' +
        'fish, their own fish collection or their own user resource.'
    }).addLink('self', '/fish')
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

    for (var i = 0; i < fishCatches.length; i++) {
      const embed = createEmbed(fishCatches[i])
      resource.addEmbed('fc:one-fish', embed)
    }

    res.send(JSON.stringify(resource))
  } catch (error) {
    next(error)
  }
}

function createEmbed (fishCatch) {
  const embed = halson({
    id: fishCatch._id,
    catcher_name: fishCatch.catcherName,
    species: fishCatch.species,
    catch_created: fishCatch.createdAt
  })
    .addLink('self', `/fish/${fishCatch._id}`)

  return embed
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
        'was accessed from: the fish or user-fish collections, or the user resource'
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
