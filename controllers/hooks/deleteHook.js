/**
 * Delete webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const Hook = require('../../models/hookModel')
const createError = require('http-errors')
const halson = require('halson')

const deleteHookController = {}

/**
 * Delete webhooks
 * Handling DELETE requests to /hooks endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next middleware func
 *
 */
deleteHookController.delete = async (req, res, next) => {
  try {
    Hook.deleteOne({ _id: req.query.hookId }, (err, hook) => {
      if (err) { return next(createError(404, 'Webhook not found')) }

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
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
function setResBody (req, res) {
  const resBody = halson({
    logged_in_user: {
      id: req.user.id,
      username: req.user.username
    },
    description: 'Webhook delete successful. Hooks should be added, ' +
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
module.exports = deleteHookController
