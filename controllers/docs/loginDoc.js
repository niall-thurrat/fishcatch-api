/**
 * login documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const loginDoc = {}

/**
 * login docuentation function
 * handles GET requests to /docs/rels/login endpoint
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
loginDoc.get = (req, res) => {
  const jsonDoc = {
    POST: {
      Request: {
        Headers: 'The request should have the Content-Type application/json,' +
             'no Authorization header required at this point',
        Body: {
          'Required properties': {
            username: 'string',
            password: 'string'
          },
          Example: {
            username: 'bobbyFish',
            password: 'b0bbysPW'
          }
        }
      },
      Response: {
        'Success returns': '200 OK',
        Headers: {
          'Content-Type': 'application/hal+json'
        },
        Body: {
          state: {
            login_success: 'bool',
            token: 'Bearer token',
            logged_in_user: 'id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            root: 'root of API',
            user: 'logged in user\'s resource'
          }
        }
      }
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = loginDoc
