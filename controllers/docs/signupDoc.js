/**
 * signup documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const signupDoc = {}

// GET /docs/rels/signup endpoint
signupDoc.get = (req, res) => {
  const jsonDoc = {
    POST: {
      Request: {
        Headers: 'The request should have the Content-Type application/json',
        Body: {
          'Required properties': {
            name: 'string: Min 2 and max 100 characters',
            username: 'string: Min 6 and max 12 characters. Must be unique',
            password: 'string: Min 8 characters. At least one number, ' +
              'one lowercase and one uppercase letter'
          },
          'Optional properties': {
            emailAddress: 'string'
          },
          Example: {
            name: 'Robert Fisher',
            username: 'bobbyFish',
            password: 'b0bbysPW',
            emailAddress: 'bobby@somewhere.com'
          }
        }
      },
      Response: {
        'Success returns': '201 Created',
        Headers: {
          Location: 'URI of the created user account'
        },
        Body: {
          state: {
            signup_success: 'bool',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            root: 'root of API',
            login: 'authentication resource'
          }
        }
      }
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = signupDoc
