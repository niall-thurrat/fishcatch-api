/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
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
                    logged_in_user: {
                      id: user._id,
                      username: user.username
                    },
                    description: 'use Bearer token in Authorization header ' +
                      'to access user resource'
                  }).addLink('self', '/users/login')
                    .addLink('curies', [{
                      name: 'fc',
                      href: `https://${req.headers.host}/docs/rels/{rel}`,
                      templated: true
                    }])
                    .addLink('fc:user', {
                      href: '/users/{username}',
                      templated: true
                    })

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
      user: req.user,
      description: 'user can view all fish and own fish collections, ' +
      'as well as add a fish'
    }).addLink('self', `/users/${req.user.username}`)
      .addLink('curies', [{
        name: 'fc',
        href: `https://${req.headers.host}/docs/rels/{rel}`,
        templated: true
      }])
      .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
      .addLink('fc:fish', '/fish')

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
      fish_catcher: req.user,
      user_fish: userFish,
      number_of_fish_in_collection: userFish.length,
      description: 'user accesses collection of their own fish. can now view a ' +
        'specific fish, add a fish, view all fish or return to user resource'
    }).addLink('self', `/users/${req.user.username}/user-fish`)
      .addLink('next', `/users/${req.user.username}/user-fish?page=2`)
      .addLink('curies', [{
        name: 'fc',
        href: `https://${req.headers.host}/docs/rels/{rel}`,
        templated: true
      }])
      .addLink('fc:user', `/users/${req.user.username}`)
      .addLink('fc:all-fish', `https://${req.headers.host}/fish`)
      .addLink('fc:one-fish', {
        href: '/fish/{fishId}',
        templated: true
      })

    res.send(JSON.stringify(resource))
  } catch (error) {
    res.status(400).send(error)
  }
}

// Exports.
module.exports = usersController
