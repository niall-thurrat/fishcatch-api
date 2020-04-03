/**
 * Webhooks controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const hooksController = {}

/**
 * Adds webhooks
 * Handling POST requests to /hooks endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next middleware func
 *
 */
hooksController.add = (req, res, next) => {
  try {
    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')
    res.charset = 'utf-8'

    const resBody = 'blablabla'

    res.send(JSON.stringify(resBody))
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = hooksController
