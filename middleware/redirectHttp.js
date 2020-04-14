/**
 * Redirect HTTP requests to HTTPS
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

/**
 * Redirect HTTP requests to same URL using https
 *
 * @param {Object} req - Request object
 * @param {Object} res - Repsonse object
 * @param {Function} next - Next middleware func
 *
 */
const redirectHttp = function (req, res, next) {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(301, `https://${req.header('host')}${req.url}`)
  } else {
    next()
  }
}

// Exports
module.exports = redirectHttp
