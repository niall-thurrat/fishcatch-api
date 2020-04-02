/**
 * Signup controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const User = require('../../models/userModel')
const createError = require('http-errors')
const halson = require('halson')

const signupController = {}

/**
 * Create new user
 * Handling POST requests to /users/signup endpoint
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - Next middleware func
 *
 */
signupController.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })

    if (user) {
      return next(createError(400, 'Username Exists in Database.'))
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        password: req.body.password
      })

      newUser.save((err, newUser) => {
        if (err) {
          return next(createError(400, err))
        } else {
          res.status(201)
          res.setHeader('Content-Type', 'application/hal+json')
          res.charset = 'utf-8'
          res.setHeader('Location',
            `https://${req.headers.host}/users/${newUser.username}`)

          const resBody = setResBody(req, res)

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
 * @param {Object} request
 * @param {Object} response
 *
 */
function setResBody (req, res) {
  const resBody = halson({
    description: 'signup required before login'
  }).addLink('self', '/users/signup')
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('root', '/')
    .addLink('fc:login', '/users/login')

  return resBody
}

// Exports
module.exports = signupController
