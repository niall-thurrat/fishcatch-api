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
    const resource = halson({
      meta: {
        title: 'FishCatch RESTful API',
        author: 'Niall Thurrat',
        description: 'The FishCatch RESTful API serves up user and fish resources' -
        'as well as accompanying API docs for client developers'
      },
      description: 'This is the root/main entry point of the API. Login requires ' +
        'signup first. Created user recources require jwt token from login request.'
    }).addLink('self', '/')
      .addLink('curies', [{
        name: 'fc',
        href: `https://${req.headers.host}/docs/rels/{rel}`,
        templated: true
      }])
      .addLink('fc:signup', '/users/signup')
      .addLink('fc:login', '/users/login')
      .addLink('fc:user', {
        href: '/users/{username}',
        templated: true
      })
      .addLink('fc:fish', '/fish')

    res.status(200)
    res.setHeader('Content-Type', 'application/hal+json')

    res.send(JSON.stringify(resource))
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = rootController
