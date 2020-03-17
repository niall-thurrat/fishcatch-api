/**
 * users controller.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a bit of help from Chris Rutherford on using passport/jwt here:
 * https://medium.com/@therealchrisrutherford/nodejs-authentication-with-passport-and-jwt-in-express-3820e256054f
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

// Exports.
module.exports = docsController
