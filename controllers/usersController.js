/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a bit of help from Chris Rutherford on using passport/jwt here:
 * https://medium.com/@therealchrisrutherford/nodejs-authentication-with-passport-and-jwt-in-express-3820e256054f
 */

'use strict'

const User = require('../models/userModel')
const FishCatch = require('../models/fishCatchModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const halson = require('halson')

const usersController = {}

// check user authorized to access user resource
usersController.authz = (req, res, next) => {
  try {
    const loggedInUser = req.user.username

    if (loggedInUser === req.params.username) {
      next()
    } else {
      return res.status(403).send('Not authorized to access this resource')
    }
  } catch (error) {
    next(error)
  }
}

// POST /users/signup endpoint
usersController.signup = (req, res, next) => {
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

          const resource = halson({
            description: 'signup required before login'
          }).addLink('self', '/')
            .addLink('curies', [{
              name: 'fc',
              href: `https://${req.headers.host}/docs/rels/{rel}`,
              templated: true
            }])
            .addLink('root', `https://${req.headers.host}/`)
            .addLink('fc:login', '/users/login')

          res.status(200)
          res.setHeader('Content-Type', 'application/hal+json')
          res.setHeader('Location', `/users/${req.body.username}`)

          res.send(JSON.stringify(resource))
        }
      })
  } catch (error) {
    res.status(400).send(error) // or next(error)?
  }
}

// POST /users/login endpoint
usersController.login = (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ username })
      .then(user => {
        if (!user) {
          const error = 'No Account Found'
          return res.status(404).json(error)
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              const payload = {
                id: user._id,
                name: user.userName,
                username: user.username,
                emailAddress: user.emailAddress
              }
              jwt.sign(payload, process.env.SECRET, { expiresIn: 7200 },
                (err, token) => {
                  if (err) {
                    res.status(500)
                      .json({
                        error: 'Error signing token',
                        raw: err
                      })
                  }
                  res.status(200)
                  res.setHeader('Content-Type', 'application/hal+json')

                  const resource = halson({
                    login_success: true,
                    token: `Bearer ${token}`,
                    logged_in_user: user,
                    instructions: 'use token in Authorization header ' +
                      'to access user resource'
                  }).addLink('self', `https://${req.headers.host}/users/login`)
                    .addLink('user', `https://${req.headers.host}/users/${username}`)

                  res.send(JSON.stringify(resource))
                })
            } else {
              const error = 'Credentials incorrect'
              res.status(400).json(error)
            }
          })
      })
  } catch (error) {
    res.status(400).send(error)
  }
}

// GET /users/:username endpoint
usersController.viewUser = async (req, res, next) => {
  try {
    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resource = halson({
      resource_username: req.user.username,
      logged_in_user: req.user,
      instructions: 'user can access fish collection resource'
    }).addLink('self', `https://${req.headers.host}/users/${req.user.username}`)
      .addLink('fish', `https://${req.headers.host}/fish`)

    res.send(JSON.stringify(resource))
  } catch (error) {
    res.status(400).send(error)
  }
}

// GET /users/:username/user-fish endpoint
usersController.viewUserFish = async (req, res, next) => {
  try {
    const userFish = await FishCatch.find({ catcherName: req.user.name })

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resource = halson({
      logged_in_user: req.user,
      user_fish: userFish,
      instructions: 'user accesses all of their fish. can either return to user or view all fish'
    }).addLink('self', `https://${req.headers.host}/users/${req.user.username}/user-fish`)
      .addLink('user', `https://${req.headers.host}/users/${req.user.username}`)
      .addLink('fish', `https://${req.headers.host}/fish`)

    res.send(JSON.stringify(resource))
  } catch (error) {
    res.status(400).send(error)
  }
}

// Exports.
module.exports = usersController
