/**
 * API root controller. Main point of entry to API.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const halson = require('halson')

const rootController = {}

rootController.getRoot = async (req, res, next) => {
  try {
    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    var resource = halson({
      apiMetaData: {
        title: 'FishCatch RESTful API',
        author: 'Niall Thurrat',
        description: 'The FishCatch RESTful API allows logged in users to view users\' records ' +
        'of caught fish and record their own catches'
      },
      instructions: 'This API root indexes all links in the API. The only links which ' +
        'should be available in clients to visitors of the root address are Login or Register'
    }).addLink('self', `https://${req.headers.host}/`)

    res.send(JSON.stringify(resource))
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = rootController
