/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
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

usersController.user = async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error) // ////////// change error status??
  }
}

// Exports.
module.exports = usersController
