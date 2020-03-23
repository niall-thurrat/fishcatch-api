/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const FishCatch = require('../models/fishCatchModel')
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
