/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

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

// Exports.
module.exports = usersController
