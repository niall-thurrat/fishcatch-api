/**
 * signup controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const User = require('../../models/userModel')
const bcrypt = require('bcryptjs')
const halson = require('halson')

const signupController = {}

/**
 * Create new user
 * handles POST requests to /users/signup endpoint
 *
 * @param {Object} request
 * @param {Object} response
 *
 */
signupController.signup = (req, res) => {
  try {
    User.findOne({ username: req.body.username })
      .then(async (err, user) => {
        if (err) throw err

        if (user) {
          return res.status(400).send('Username Exists in Database.')
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

        const resBody = setResBody(req, res)

        res.status(201)
        res.setHeader('Content-Type', 'application/hal+json')
        res.setHeader('Location',
          `https://${req.headers.host}/users/${req.body.username}`)

        res.send(JSON.stringify(resBody))
      })
  } catch (error) {
    res.status(400).send(error)
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
