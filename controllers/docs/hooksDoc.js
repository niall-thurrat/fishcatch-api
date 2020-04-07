/**
 * webhooks documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const hooksDoc = {}

/**
 * webhooks docuentation function
 * handles GET requests to /docs/rels/hooks endpoint
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
hooksDoc.get = (req, res) => {
  const jsonDoc = {
    POST: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
              'Authorization header required with Bearer token ' +
              'that is received at login',
        Body: {
          keys: {
            destination: 'Value is a destination URI where notifications should be sent'
          }
        }
      },
      Response: {
        'Success returns': '201 Created',
        Headers: {
          'Content-Type': 'application/hal+json'
        },
        Body: {
          state: {
            registered_hook: {
              hook_key_info: 'The key attribute of the registered hook is of particular ' +
                    'importance. FishCatch API uses a HMAC hexdigest of this key + the body of ' +
                    'hook notifications to create X-Hub-Signature headers on notifications. Use ' +
                    'this key to validate webhooks.',
              'X-Hub-Signature_generation_example_using_crypto_npm_package': [
                'const generateSig = (body, key) => {',
                'const hmac = crypto.createHmac(\'sha1\', key)',
                'const selfSig = hmac.update(JSON.stringify(body)).digest(\'hex\')',
                'return \'sha1=\' + selfSig'
              ]
            },
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            user: 'logged on user\'s resource'
          }
        }
      }
    },
    GET: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
              'Authorization header required with Bearer token ' +
              'that is received at login',
        Params: {
          route_params: 'hookId required for URI path',
          uri_example: 'https://api.host.com/hooks/5e8c84861e9b747a80237f99'
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
            registered_hook: 'details of newly registered webhook',
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            user: 'logged on user\'s resource'
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
          route_params: 'hookId required for URI path',
          uri_example: 'https://api.host.com/hooks/5e8c84861e9b747a80237f99'
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
            user: 'logged on user\'s resource'
          }
        }
      }
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = hooksDoc
