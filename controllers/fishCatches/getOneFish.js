/**
 * Get (one) fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')
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
      if (err) throw err

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')

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

  return resBody
}

// Exports
module.exports = getOneFishController
