/**
 * Get webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const Hook = require('../../models/hookModel')
const createError = require('http-errors')

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

      const resBody = {
        info: 'Webhook request successful',
        registered_webhook: hook
      }

      res.send(JSON.stringify(resBody))
    })
  } catch (error) {
    next(error)
  }
}

// Exports
module.exports = getHookController
