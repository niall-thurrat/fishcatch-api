/**
 * Get webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const Hook = require('../../models/hookModel')
const createError = require('http-errors')
const halson = require('halson')

const getHookController = {}

/**
 * Get webhooks
 * Handling GET requests to /hooks endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next middleware func
 *
 */
getHookController.get = async (req, res, next) => {
  try {
    Hook.findById(req.query.hookId, (err, hook) => {
      if (err) { return next(createError(404, 'Webhook not found')) }

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')
      res.charset = 'utf-8'

      const resBody = setResBody(req, res, hook)

      res.send(JSON.stringify(resBody))
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} hook - Hook object
 *
 */
function setResBody (req, res, hook) {
  const resBody = halson({
    registered_hook: hook,
    logged_in_user: {
      id: req.user.id,
      username: req.user.username
    },
    description: 'Webhook request successful. Hooks should be added, ' +
        'viewed and deleted from users\' own pages'
  }).addLink('self', '/hooks')
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:user', `/users/${req.user.username}`)

  return resBody
}

// Exports
module.exports = getHookController
