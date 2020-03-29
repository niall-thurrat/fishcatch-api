/**
 * API root controller. Main point of entry to API.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const halson = require('halson')

const rootController = {}

/**
 * API root
 * Handling GET requests to / endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next middleware func
 *
 */
rootController.getRoot = (req, res, next) => {
  try {
    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

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
    meta: {
      title: 'FishCatch RESTful API',
      author: 'Niall Thurrat',
      description: 'The FishCatch RESTful API serves up user and fish resources ' -
      'as well as accompanying API docs for client developers'
    },
    description: 'This is the root/main entry point of the API. Signup required ' +
      'then jwt token from login before access to any other resource.'
  }).addLink('self', '/')
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:signup', '/users/signup')
    .addLink('fc:login', '/users/login')
    .addLink('fc:user', {
      href: '/users/{username}',
      templated: true
    })
    .addLink('fc:fish', '/fish')

  return resBody
}

// Exports.
module.exports = rootController
