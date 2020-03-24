/**
 * Delete fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const FishCatch = require('../../models/fishCatchModel')
const halson = require('halson')

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
      if (err) throw err

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')

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

  return resBody
}

// Exports
module.exports = deleteFishController