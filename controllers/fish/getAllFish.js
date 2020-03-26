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
    const offset = getQueryInt(req.query.offset, 0)
    let limit = getQueryInt(req.query.limit, 10)

    const sortQuery = req.query.sort
    const sortOptions = ['catcherName', 'createdAt', 'species', 'weight', 'length']
    const sortArg = setSortArg(res, sortQuery, sortOptions)

    // move on if sortArg failed validation in setSortArg
    if (typeof sortArg !== 'string') {
      return
    }

    // limit restricted to 50 fish resources
    limit = limit > 50 ? 50 : limit

    const totalDocs = await FishCatch.countDocuments({})
    const fishCatches = await FishCatch.find({})
      .sort(sortArg).skip(offset).limit(limit)

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
 * Performs sort query paramater validation.
 * Returns string argument for mongoose's sort function.
 *
 * @param {Object} res - response object
 * @param {String} sortQuery - a sort query parameter
 * @param {Object} sortOptions - array of possible sort properties
 *
 */
function setSortArg (res, sortQuery, sortOptions) {
  let sortString = ''

  if (sortQuery === undefined) {
    // default sort newest to oldest
    sortString = '-createdAt'
  } else {
    let [sortOpt, order] = sortQuery.split(':')

    if (!sortOptions.includes(sortOpt)) {
      return res.status(400)
        .send('Invalid "sort" parameter')
    }

    if (order === undefined) {
      order = 'asc'
    }

    if (order !== 'asc' && order !== 'desc') {
      return res.status(400)
        .send('Invalid "sort" order')
    }

    sortString = sortOpt

    if (order === 'desc') {
      sortString = '-' + sortString
    }
  }

  return sortString
}

/**
 * Returns a HAL formatted JSON object
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
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
    description: 'Collection of fish taken from db using offset + limit ' +
      'query parameters. From here users should be able to view a single ' +
      'fish, their own fish collection or their own user resource.'
  }).addLink('self', '/fish')
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:user', `/users/${req.user.username}`)
    .addLink('fc:user-fish', `/users/${req.user.username}/user-fish`)

  for (var i = 0; i < foundCount; i++) {
    const embed = embedFish(fishCatches[i])
    resBody.addEmbed('fc:one-fish', embed)
  }

  return resBody
}

// Exports
module.exports = getAllFishController
