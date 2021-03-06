/**
 * Login controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const User = require('../../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')
const halson = require('halson')

const loginController = {}

/**
 * Logs a user in to FishCatch API
 * Handling POST requests to /users/login endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - Next middleware func
 *
 */
loginController.login = async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({ username })

    if (!user) {
      return next(createError(401, 'No Account Found'))
    } else {
      const isMatch = await user.comparePassword(password)

      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.name,
          username: user.username,
          emailAddress: user.emailAddress
        }

        jwt.sign(payload, process.env.SECRET, { expiresIn: 7200 },
          (err, token) => {
            if (err) {
              return next(createError(500, 'Error signing JWT'))
            }

            res.status(200)
            res.setHeader('Content-Type', 'application/hal+json')
            res.charset = 'utf-8'

            const resBody = setResBody(req, res, token, user)

            res.send(JSON.stringify(resBody))
          })
      } else {
        return next(createError(401, 'Credentials incorrect'))
      }
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} token - JSON Web Token
 * @param {Object} user - user that's logging in
 *
 */
function setResBody (req, res, token, user) {
  const resBody = halson({
    login_success: true,
    token: `Bearer ${token}`,
    logged_in_user: {
      id: user._id,
      username: user.username
    },
    description: 'use Bearer token in Authorization header ' +
    'to access user and fish resources'
  }).addLink('self', '/users/login')
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('root', '/')
    .addLink('fc:user', `/users/${user.username}`)

  return resBody
}

// Exports
module.exports = loginController
