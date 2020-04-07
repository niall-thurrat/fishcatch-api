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

          const resBody = {
            info: 'The webhook has been successfully registered. Keep the key for validation ' +
              'of future webhooks',
            registered_hook: newHook
          }

          res.send(JSON.stringify(resBody))
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

// Exports
module.exports = addHookController
