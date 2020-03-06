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

// Exports.
module.exports = usersController
