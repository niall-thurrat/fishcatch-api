/**
 * (all) fish documentation resource controller
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const FishCatch = require('../../models/fishCatchModel')

const allFishDoc = {}

/**
 * (all) fish docuentation function
 * handles GET requests to /docs/rels/all-fish endpoint
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 *
 */
allFishDoc.get = (req, res) => {
  const sortOptions = []
  FishCatch.schema.eachPath(path => sortOptions.push(path))

  const jsonDoc = {
    GET: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
            'Authorization header required with Bearer token ' +
            'that is received at login',
        Params: {
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
          uri_example: 'https://api.host.com/fish?offset=20&limit=20&sort=species:asc'
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
                'from db. shows 0 if offset > total fish in db',
            to: 'number: position of final fish retrieved ' +
                'from db. shows 0 if offset > total fish in db',
            of_total_user_fish: 'number: total fish in db',
            logged_in_user: 'current user\'s id and username',
            description: 'a little extra help for developers :)'
          },
          links: {
            self: 'current resource',
            user: 'logged on user\'s resource',
            'user-fish': 'collection of logged on user\'s fish',
            'one-fish': 'a single fish resource'
          },
          embedded: 'all fish returned from db using offset + limit params'
        }
      }
    },
    POST: {
      Request: {
        Headers: 'Content-Type should be application/json, ' +
            'Authorization header required with Bearer token ' +
            'that is received at login',
        Body: {
          catchLatitude: {
            type: Number,
            required: true
          },
          catchLongitude: {
            type: Number,
            required: true
          },
          species: {
            type: String,
            required: true
          },
          weight: {
            type: Number,
            required: true
          },
          length: {
            type: Number,
            required: true
          }
        }
      },
      Response: {
        'Success returns': '201 Created',
        Headers: {
          'Content-Type': 'application/hal+json',
          Location: 'URI of newly created resource'
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
    }
  }
  res.send(jsonDoc)
}

// Exports
module.exports = allFishDoc
