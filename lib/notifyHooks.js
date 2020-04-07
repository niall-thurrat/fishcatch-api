/**
 * Notify webhooks of events
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const Hook = require('../models/hookModel')
const fetch = require('node-fetch')
const crypto = require('crypto')

const hooks = {}

/**
 * Notify webhooks when fish is added in API
 *
 * @param {Object} fish
 * @param {Object} next
 *
 */
hooks.fishAdded = (fish, next) => {
  try {
    const body = {
      info: 'This is a FishCatch API webhook. A fish catch has been added!',
      fishCatch: fish
    }

    Hook.find({}).then(hooks => hooks.map(hook =>
      fetch(hook.url, {
        headers: {
          'Content-Type': 'application/hal+json; charset=utf-8',
          'X-Hub-Signature': generateSig(body, hook.key)
        },
        method: 'POST',
        body: JSON.stringify(body)
      })
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Generate X-Hub-Signature
 *
 * @param {Object} body - Request body sent to user
 * @param {String} key - Hook key
 */
const generateSig = (body, key) => {
  const hmac = crypto.createHmac('sha1', key)
  const selfSig = hmac.update(JSON.stringify(body)).digest('hex')
  return `sha1=${selfSig}`
}

// Exports
module.exports = hooks
