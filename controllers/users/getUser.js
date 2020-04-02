/**
 * getUser controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')

const getUserController = {}

/**
 * Get user resource
 * Handling GET requests to /users/:username endpoint
 *
 * @param {Object} request
 * @param {Object} response
 *
 */
getUserController.get = async (req, res, next) => {
  try {
    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')
    res.charset = 'utf-8'
    res.cacheControl = { maxAge: 60, mustRevalidate: true }

    const resBody = setResBody(req, res)

    res.send(JSON.stringify(resBody))
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} request
 * @param {Object} response
 *
 */
function setResBody (req, res) {
  const resBody = halson({
    logged_in_user: {
      id: req.user.id,
      username: req.user.username
    },
    description: 'user can view all fish and own fish collections, ' +
      'as well as add a fish'
  }).addLink('self', `/users/${req.user.username}`)
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
    .addLink('fc:fish', '/fish')

  return resBody
}

// Exports
module.exports = getUserController
