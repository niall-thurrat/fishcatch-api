/**
 * documentation resource controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const docsController = {}

// GET /docs/rels/signup endpoint
docsController.signupDoc = (req, res, next) => {
  try {
    const jsonDoc = {
      Request: {
        'Expected request method(s)': 'POST',
        Headers: 'The request should have the Content-Type application/json',
        Body: {
          'Required properties': {
            name: 'string',
            username: 'string',
            password: 'string'
          },
          'Optional properties': {
            emailAddress: 'string'
          },
          Example: {
            name: 'Robert Fisher',
            username: 'bobby',
            password: 'bobbysPW',
            emailAddress: 'bobby@somewhere.com'
          }
        }
      },
      Response: {
        'Success returns': '201 Created',
        Headers: {
          Location: 'URI of the created user account'
        },
        Body: 'HAL resource with further guidance :)'
      }
    }

    res.send(jsonDoc)
  } catch (error) {
    next(error)
  }
}

// GET /docs/rels/login endpoint
docsController.loginDoc = (req, res, next) => {
  try {
    const jsonDoc = {
      Request: {
        'Expected request method(s)': 'POST',
        Headers: 'The request should have the Content-Type application/json,' +
           'no Authorization header required at this point',
        Body: {
          'Required properties': {
            username: 'string',
            password: 'string'
          },
          Example: {
            username: 'bobby',
            password: 'bobbysPW'
          }
        }
      },
      Response: {
        'Success returns': '200 OK',
        Headers: {
          'Content-Type': 'application/hal+json'
        },
        Body: {
          token: 'Bearer token',
          logged_in_user: 'id and username'
        }
      }
    }

    res.send(jsonDoc)
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = docsController
