/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a bit of help from Chris Rutherford on this one:
 * https://medium.com/@therealchrisrutherford/nodejs-authentication-with-passport-and-jwt-in-express-3820e256054f
 */

'use strict'

const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usersController = {}

usersController.signup = async (req, res, next) => {
  try {
    User.findOne({ username: req.body.username })
      .then(user => {
        if (user) {
          const error = 'Username Exists in Database.'
          return res.status(400).json(error)
        } else {
          const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            emailAddress: req.body.emailAddress,
            password: req.body.password
          })
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(newUser.password, salt,
              (err, hash) => {
                if (err) throw err
                newUser.password = hash
                newUser.save().then(user => res.json(user))
              })
          })
        }
      })
  } catch (error) {
    res.status(400).send(error)
  }
}

usersController.login = async (req, res, next) => {
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
                  res.json({
                    success: true,
                    token: `Bearer ${token}`
                  })
                })
            } else {
              const error = 'Password is incorrect'
              res.status(400).json(error)
            }
          })
      })
  } catch (error) {
    res.status(400).send(error)
  }
}

usersController.viewUser = async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
}

// Exports.
module.exports = usersController
