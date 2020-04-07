/**
 * Add webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const Hook = require('../../models/hookModel')
const createError = require('http-errors')
const crypto = require('crypto')
const halson = require('halson')

const addHookController = {}

/**
 * Adds webhooks
 * Handling POST requests to /hooks endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next middleware func
 *
 */
addHookController.add = async (req, res, next) => {
  try {
    const hook = await Hook.findOne({ url: req.body.destination })

    if (hook) {
      return next(createError(400, 'Webhook alread exists'))
    } else {
      const newHook = new Hook({
        username: req.user.username,
        url: req.body.destination,
        key: crypto.randomBytes(32).toString('hex')
      })

      newHook.save((err, newHook) => {
        if (err) {
          return next(createError(400, err))
        } else {
          res.status(201)
          res.setHeader('Content-Type', 'application/hal+json')
          res.charset = 'utf-8'

          const resBody = setResBody(req, res, newHook)

          res.send(JSON.stringify(resBody))
        }
      })
    }
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
    description: 'The webhook has been successfully registered. Keep the key ' +
      'for validation of future webhooks. Hooks should be added, viewed and  ' +
      'deleted from users\' own pages'
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
module.exports = addHookController
