/**
 * Authorization middleware
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const createError = require('http-errors')
const FishCatch = require('../models/fishCatchModel')
const Hook = require('../models/hookModel')

const authz = {}

/**
 * Check user authorized to access user resource
 *
 * @param {Object} req - Request object
 * @param {Object} res - Repsonse object
 * @param {Function} next - Next middleware func
 *
 */
authz.user = (req, res, next) => {
  try {
    const loggedInUser = req.user.username

    if (loggedInUser === req.params.username) {
      next()
    } else {
      return next(createError(403, 'Not authorized to access this resource'))
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Check user authorized to access fish resource
 *
 * @param {Object} req - Request object
 * @param {Object} res - Repsonse object
 * @param {Function} next - Next middleware func
 *
 */
authz.fish = async (req, res, next) => {
  try {
    const fishCatch = await FishCatch.findById(req.params.fishId)

    if (!fishCatch) {
      return next(createError(404, 'Resource not found in database'))
    } else {
      if (fishCatch.catcherUsername === req.user.username) {
        next()
      } else {
        return next(createError(403, 'Not authorized to access this resource'))
      }
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Check user authorized to access webhook resource
 *
 * @param {Object} req - Request object
 * @param {Object} res - Repsonse object
 * @param {Function} next - Next middleware func
 *
 */
authz.hook = async (req, res, next) => {
  try {
    const hook = await Hook.findById(req.query.hookId)

    if (!hook) {
      return next(createError(404, 'Resource not found'))
    } else {
      if (hook.username === req.user.username) {
        next()
      } else {
        return next(createError(403, 'Not authorized to access this resource'))
      }
    }
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = authz
