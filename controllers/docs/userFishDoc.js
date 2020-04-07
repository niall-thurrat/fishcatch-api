/**
 * user-fish documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const FishCatch = require('../../models/fishCatchModel')

const userFishDoc = {}

/**
 * user-fish docuentation function
 * handles GET requests to /docs/rels/user-fish endpoint
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
userFishDoc.get = (req, res) => {
  const sortOptions = []
  FishCatch.schema.eachPath(path => sortOptions.push(path))

  const jsonDoc = {
    GET: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
            'Authorization header required with Bearer token ' +
            'that is received at login',
        Params: {
          route_params: 'username required to complete user-fish URI',
          query_params: {
            offset: 'number: start position of fishCatches requested' +
              'from user-fish collection. Defaults to 0 if not specified',
            limit: 'number: total amount of fishCatches requested from ' +
              'user-fish collection. Defaults to 10 if not specified',
            sort: {
              description: 'String: Takes any fishCatch attribute as listed ' +
                  'below in sort_options. Set :asc or :desc to order results. ' +
                  'Defaults to createdAt:desc if not specified',
              sort_options: sortOptions
            }
          },
          uri_example: 'https://api.host.com/users/user-fish?offset=20&limit=20&sort=species:asc'
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
            showing_user_fish_from: 'number: offset position of first fish retrieved ' +
                'from db. shows 0 if offset > total user fish in db',
            to: 'number: position of final fish retrieved ' +
                'from db. shows 0 if offset > total user fish in db',
            of_total_user_fish: 'number: total user fish in db',
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            user: 'logged on user\'s resource',
            'all-fish': 'collection of all fish',
            'one-fish': 'a single fish resource'
          },
          embedded: 'all fish returned from db using offset + limit params'
        }
      }
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = userFishDoc
