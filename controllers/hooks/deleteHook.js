/**
 * Delete webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const Hook = require('../../models/hookModel')
const createError = require('http-errors')

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

      res.send('Webhook deletion successful')
    })
  } catch (error) {
    next(error)
  }
}

// Exports
module.exports = deleteHookController
