/**
 * Signup controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const User = require('../../models/userModel')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const halson = require('halson')

const signupController = {}

/**
 * Create new user
 * Handling POST requests to /users/signup endpoint
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next - Next middleware func
 *
 */
signupController.signup = (req, res, next) => {
  try {
    User.findOne({ username: req.body.username })
      .then(async (user) => {
        if (user) {
          next(createError(400, 'Username Exists in Database.'))
        } else {
          const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            emailAddress: req.body.emailAddress,
            password: req.body.password
          })
          await bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err

            bcrypt.hash(newUser.password, salt,
              (err, hash) => {
                if (err) throw err

                newUser.password = hash
                newUser.save()
              })
          })
        }

        res.status(201)
        res.setHeader('Content-Type', 'application/hal+json')
        res.setHeader('Location',
          `https://${req.headers.host}/users/${req.body.username}`)

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
