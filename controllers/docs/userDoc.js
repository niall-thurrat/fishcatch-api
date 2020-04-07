/**
 * user documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const userDoc = {}

/**
 * user docuentation function
 * handles GET requests to /docs/rels/user endpoint
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
userDoc.get = (req, res) => {
  const jsonDoc = {
    GET: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
              'Authorization header required with Bearer token ' +
              'that is received at login',
        Route_params: 'username required to complete user URI',
        Body: 'none'
      },
      Response: {
        'Success returns': '200 OK',
        Headers: {
          'Content-Type': 'application/hal+json'
        },
        Body: {
          state: {
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            'user-fish': 'collection of logged on user\'s fish',
            'all-fish': 'collection of all fish',
            hooks: 'webhooks service - allows adding, viewing and deletion of webhooks'
          }
        }
      }
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = userDoc
