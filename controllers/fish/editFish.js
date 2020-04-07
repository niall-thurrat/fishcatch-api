/**
 * Edit fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')
const createError = require('http-errors')
const FishCatch = require('../../models/fishCatchModel')

const editFishController = {}

/**
 * Edit fish resource
 * Handling PATCH requests to /fish/:fishId endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - Next middleware func
 *
 */
editFishController.edit = (req, res, next) => {
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
        if (err) return next(createError(404, 'error finding fish', err))

        res.status(200)
        res.setHeader('Content-Type', 'application/hal+json')
        res.charset = 'utf-8'

        const resBody = setResBody(req, res, fish)

        res.send(JSON.stringify(resBody))
      })
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} fish - fishCatch object
 *
 */
function setResBody (req, res, fish) {
  const resBody = halson({
    fish_catch: fish,
    logged_in_user: {
      id: req.user.id,
      username: req.user.username
    },
    description: 'Fish resource updated'
  }).addLink('self', `/fish/${fish._id}`)
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:all-fish', '/fish')
    .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
    .addLink('fc:user', `/users/${req.user.username}`)

  return resBody
}

// Exports
module.exports = editFishController
