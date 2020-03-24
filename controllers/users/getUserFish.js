/**
 * GetUserFish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const FishCatch = require('../../models/fishCatchModel')
const halson = require('halson')

const userFishController = {}

/**
 * Get a collection of a user's fish resources
 * Handling GET requests to /users/:username/user-fish endpoint
 *
 * @param {Object} request
 * @param {Object} response
 *
 */
userFishController.get = async (req, res) => {
  try {
    const userFish = await FishCatch.find({ catcherName: req.user.name })

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resBody = setResBody(req, res, userFish)

    res.send(JSON.stringify(resBody))
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
function setResBody (req, res, userfish) {
  const resBody = halson({
    fish_catcher: req.user,
    // user_fish: userFish,
    // number_of_fish_in_collection: userFish.length,
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

  return resBody
}

// Exports
module.exports = userFishController
