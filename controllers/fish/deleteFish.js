/**
 * Delete fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const halson = require('halson')
const createError = require('http-errors')
const FishCatch = require('../../models/fishCatchModel')

const deleteFishController = {}

/**
 * Delete fish resource
 * Handling DELETE requests to /fish/:fishId endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - Next middleware func
 *
 */
deleteFishController.delete = (req, res, next) => {
  try {
    FishCatch.deleteOne({ _id: req.params.fishId }, (err, fish) => {
      if (err) return next(createError(404, 'error deleting fish', err))

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')
      res.charset = 'utf-8'

      const resBody = setResBody(req, res)

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
function setResBody (req, res) {
  const resBody = halson({
    logged_in_user: {
      id: req.user.id,
      username: req.user.username
    },
    description: 'Fish resource deleted. Can direct user to ' +
    'the fish/user-fish collection or the user\'s own resource'
  }).addLink('curies', [{
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
module.exports = deleteFishController
