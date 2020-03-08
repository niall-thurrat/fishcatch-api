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

const User = require('../models/userModel')

const usersController = {}

usersController.signup = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    await user.save()

    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
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
