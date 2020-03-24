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
const getQueryInt = require('../../utils/getQueryInt')
const embedFish = require('../../utils/embedFish')

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
    const offset = getQueryInt(req.query.offset, 0)
    const limit = getQueryInt(req.query.limit, 10)

    const totalDocs = await FishCatch
      .countDocuments({ catcherName: req.user.name })
    const userFish = await FishCatch.find({ catcherName: req.user.name })
      .sort('-date').skip(offset).limit(limit)

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resBody = setResBody(req, res, totalDocs, userFish, offset)

    res.send(JSON.stringify(resBody))
  } catch (error) {
    res.status(400).send(error)
  }
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Number} totalCount - total number of user's fish in db
 * @param {Object} userFish - Collection of user's fish, got using offset + limit
 * @param {Number} offset - where we began retrieving user's fish from db
 *
 */
function setResBody (req, res, totalCount, userFish, offset) {
  const foundCount = userFish.length

  const resBody = halson({
    fish_catcher: req.user,
    showing_user_fish_from: offset > totalCount ? 0 : offset,
    to: offset > totalCount ? 0 : (offset + foundCount),
    of_total_user_fish: totalCount === 0 ? 'no fish' : totalCount,
    description: 'User accesses collection of their own fish. can now view a ' +
            'specific fish, add a fish, view all fish or return to user resource'
  }).addLink('self', `/users/${req.user.username}/user-fish`)
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

  for (var i = 0; i < foundCount; i++) {
    const embed = embedFish(userFish[i])
    resBody.addEmbed('fc:one-fish', embed)
  }

  return resBody
}

// Exports
module.exports = userFishController
