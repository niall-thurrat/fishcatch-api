/**
 * Add fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')
const createError = require('http-errors')
const FishCatch = require('../../models/fishCatchModel')

const addFishController = {}

/**
 * Add fish resource
 * Handling POST requests to /fish endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - Next middleware func
 *
 */
addFishController.add = (req, res, next) => {
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
      if (err) return next(createError(400, 'fishCatch validation failed', err))

      res.status(201)
      res.setHeader('Content-Type', 'application/hal+json')
      res.charset = 'utf-8'
      res.setHeader('Location', `https://${req.headers.host}/fish/${fish._id}`)

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
    description: 'Fish resouce has been added and will show in both fish ' +
          '+ user-fish collections. User can be directed to the new fish ' +
          'resource or back to where the fish is added from: a fish ' +
          'collection or the user resource'
  }).addLink('self', `/fish/${fish._id}`)
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:fish', '/fish')
    .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
    .addLink('fc:user', `/users/${req.user.username}`)

  return resBody
}

// Exports
module.exports = addFishController
