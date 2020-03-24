/**
 * Get (all) fish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')
const FishCatch = require('../../models/fishCatchModel')
const getQueryInt = require('../../utils/getQueryInt')
const embedFish = require('../../utils/embedFish')

const getAllFishController = {}

/**
 * Get fish resources
 * Handling GET requests to /fish endpoint
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next - Next middleware func
 *
 */
getAllFishController.get = async (req, res, next) => {
  try {
    const offset = getQueryInt(req.query.offset, 2)
    const limit = getQueryInt(req.query.limit, 3)

    const totalDocs = await FishCatch.countDocuments({})
    const fishCatches = await FishCatch.find({})
      .sort('-date').skip(offset).limit(limit)

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    const resBody = setResBody(
      req, res, totalDocs, fishCatches, offset)

    res.send(JSON.stringify(resBody))
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Number} totalCount - total number of fish in db
 * @param {Object} fishCatches - collection of fishCatches, got using offset + limit
 * @param {Number} offset - where we began retrieving fish from db
 *
 */
function setResBody (req, res, totalCount, fishCatches, offset) {
  const foundCount = fishCatches.length

  const resBody = halson({
    showing_fish_from: offset > totalCount ? 0 : offset,
    to: offset > totalCount ? 0 : (offset + foundCount),
    of_total_fish: totalCount === 0 ? 'no fish' : totalCount,
    description: 'Collection of all fish. Direct users to view a single ' +
            'fish, their own fish collection or their own user resource.'
  }).addLink('self', '/fish')
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:user', `/users/${req.user.username}`)
    .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)
    .addLink('fc:one-fish', {
      href: '/fish/{fishId}',
      templated: true
    })

  for (var i = 0; i < foundCount; i++) {
    const embed = embedFish(fishCatches[i])
    resBody.addEmbed('fc:one-fish', embed)
  }

  return resBody
}

// Exports
module.exports = getAllFishController
