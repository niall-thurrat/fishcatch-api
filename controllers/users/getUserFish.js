/**
 * GetUserFish controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const halson = require('halson')
const createError = require('http-errors')
const FishCatch = require('../../models/fishCatchModel')
const getQueryInt = require('../../utils/getQueryInt')
const embedFish = require('../../utils/embedFish')

const userFishController = {}

/**
 * Get a collection of a user's fish resources
 * Handling GET requests to /users/:username/user-fish endpoint
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next - Next middleware func
 *
 */
userFishController.get = async (req, res, next) => {
  try {
    const offset = getQueryInt(req.query.offset, 0)
    let limit = getQueryInt(req.query.limit, 10)

    const sortQuery = req.query.sort
    const sortOptions = []

    // get all possible sort options from model
    FishCatch.schema.eachPath(path => sortOptions.push(path))

    // string argument for mongoose sort function
    const sortArg = setSortArg(res, sortQuery, sortOptions)

    // move on if sort query param failed validation in setSortArg
    if (typeof sortArg !== 'string') {
      return next()
    } else {
      // limit cannot exceed 50 fish resources
      limit = limit > 50 ? 50 : limit

      const totalDocs = await FishCatch
        .countDocuments({ catcherUsername: req.user.username })

      const userFish = await FishCatch.find({ catcherUsername: req.user.username })
        .sort(sortArg).skip(offset).limit(limit)

      res.status(200)
      res.setHeader('Content-Type', 'application/hal+json')
      res.charset = 'utf-8'
      res.cacheControl = { maxAge: 60, mustRevalidate: true }

      const resBody = setResBody(req, res, totalDocs, userFish, offset)

      res.send(JSON.stringify(resBody))
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Performs sort query paramater validation.
 * Creates and returns string argument for mongoose's sort function.
 *
 * @param {Object} res - response object
 * @param {String} sortQuery - a sort query parameter
 * @param {Object} sortOptions - array of possible sort properties
 *
 */
function setSortArg (res, sortQuery, sortOptions) {
  let sortArg = ''

  if (sortQuery === undefined) {
    // default sort newest to oldest
    sortArg = '-createdAt'
  } else {
    let [sortType, order] = sortQuery.split(':')

    if (!sortOptions.includes(sortType)) {
      throw createError(400, 'Invalid "sort" parameter')
    }

    if (order !== 'asc' && order !== 'desc') {
      throw createError(400, 'Invalid "sort" order')
    }

    if (order === undefined) {
      order = 'asc'
    }

    sortArg = sortType

    if (order === 'desc') {
      sortArg = '-' + sortArg
    }
  }
  return sortArg
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
    showing_user_fish_from: offset > totalCount ? 0 : offset,
    to: offset > totalCount ? 0 : (offset + foundCount),
    of_total_user_fish: totalCount === 0 ? 'no fish' : totalCount,
    logged_in_user: {
      id: req.user.id,
      username: req.user.username
    },
    description: 'user accesses collection of their own fish. offset + limit queries can ' +
      'be used for pagination (limit cannot excede 50). sort query takes any fishCatch ' +
      'attribute as well as an order (:asc or :desc). User can now view a specific fish, ' +
      'add a fish, view all fish and view own user resource. ' +
      'see /docs/rels/user-fish for full details'
  }).addLink('self', `/users/${req.user.username}/user-fish`)
    .addLink('curies', [{
      name: 'fc',
      href: `https://${req.headers.host}/docs/rels/{rel}`,
      templated: true
    }])
    .addLink('fc:user', `/users/${req.user.username}`)
    .addLink('fc:all-fish', '/fish')
    .addLink('fc:one-fish', {
      href: '/fish/{fishId}',
      templated: true
    })

  // embed requested fishCatches
  for (var i = 0; i < foundCount; i++) {
    const embed = embedFish(userFish[i])
    resBody.addEmbed('fc:one-fish', embed)
  }

  return resBody
}

// Exports
module.exports = userFishController
