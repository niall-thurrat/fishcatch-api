/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a little help from Frank Atukunda for this one:
 * https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122
 */

'use strict'

const bcrypt = require('bcryptjs')
// const passport = require('passport')
// const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
// const secret = process.env.SECRET

const usersController = {}

// usersController.signup = async (req, res, next) => {
//   try {
//     const user = new User({
//       username: req.body.username,
//       password: req.body.password
//     })
//     await user.save()

//     const token = await user.generateAuthToken()
//     res.status(201).send({ user, token })
//   } catch (error) {
//     res.status(400).send(error)
//   }
// }

usersController.signup = async (req, res, next) => {
  try {
    var user = await User.findOne({ emailAddress: req.body.emailAddress })

    if (user) {
      const error = 'Email Address Exists in Database.'
      return res.status(400).json(error)
    } else {
      const newUser = new User({
        name: req.body.name,
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
              .catch(err => res.status(400).json(err))
          })
      })
    }
  } catch (error) {
    res.status(400).send(error)
  }
}

usersController.login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findByCredentials(username, password)
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }

    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

usersController.viewUser = async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error) // ////////// change error status??
  }
}

usersController.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send('successful logout')
  } catch (error) {
    res.status(500).send(error)
  }
}

// Exports.
module.exports = usersController
