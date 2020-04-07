/**
 * one-fish documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const oneFishDoc = {}

/**
 * one-fish docuentation function
 * handles GET requests to /docs/rels/one-fish endpoint
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
oneFishDoc.get = (req, res) => {
  const jsonDoc = {
    GET: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
              'Authorization header required with Bearer token ' +
              'that is received at login',
        Params: {
          route_params: 'fishId required for URI path',
          uri_example: 'https://api.host.com/fish/5e8c76926748914cd0c6a396'
        },
        Body: 'none'
      },
      Response: {
        'Success returns': '200 OK',
        Headers: {
          'Content-Type': 'application/hal+json',
          'Cache-Control': 'must-revalidate,max-age=60'
        },
        Body: {
          state: {
            fish_catch: 'details of newly added fish',
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            user: 'logged on user\'s resource',
            'user-fish': 'collection of logged on user\'s fish',
            'all-fish': 'collection of all fish'
          }
        }
      }
    },
    PATCH: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
              'Authorization header required with Bearer token ' +
              'that is received at login',
        Params: {
          route_params: 'fishId required for URI path',
          uri_example: 'https://api.host.com/fish/5e8c76926748914cd0c6a396'
        },
        Body: {
          info: 'add any of the keys below to edit the fish resource',
          keys: {
            catchLatitude: 'Number',
            catchLongitude: 'Number',
            species: 'String',
            weight: 'Number',
            length: 'Number'
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
            fish_catch: 'details of newly updated fish',
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            user: 'logged on user\'s resource',
            'user-fish': 'collection of logged on user\'s fish',
            'all-fish': 'collection of all fish'
          }
        }
      }
    },
    DELETE: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
              'Authorization header required with Bearer token ' +
              'that is received at login',
        Params: {
          route_params: 'fishId required for URI path',
          uri_example: 'https://api.host.com/fish/5e8c76926748914cd0c6a396'
        },
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
            user: 'logged on user\'s resource',
            'user-fish': 'collection of logged on user\'s fish',
            'all-fish': 'collection of all fish'
          }
        }
      }
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = oneFishDoc
