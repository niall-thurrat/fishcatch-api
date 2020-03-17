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
      meta: {
        title: 'FishCatch RESTful API',
        author: 'Niall Thurrat',
        description: 'The FishCatch RESTful API provides user and fish resources'
      },
      description: 'This is the root/main entry point of the API' +
        'should be available in clients to visitors of the root address are Login or Register'
    }).addLink('self', `https://${req.headers.host}/`)

    res.send(JSON.stringify(resource))
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = rootController
