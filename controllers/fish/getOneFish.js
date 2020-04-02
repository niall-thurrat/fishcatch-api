/**
 * Get (one) fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')
const createError = require('http-errors')
const FishCatch = require('../../models/fishCatchModel')

const getOneFishController = {}

/**
 * Get (one) fish resource
 * Handling GET requests to /fish/:fishId endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - Next middleware func
 *
 */
getOneFishController.get = (req, res, next) => {
  try {
    FishCatch.findById(req.params.fishId, (err, fish) => {
      if (err) return next(createError(404, 'error finding fish', err))

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')
      res.charset = 'utf-8'
      res.cacheControl = { maxAge: 60, mustRevalidate: true }

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
    description: 'Fish resource presented to authorized user. User ' +
    'edit, and delete resource as well as view fish + user-fish ' +
    'collections and own user resource'
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
module.exports = getOneFishController
