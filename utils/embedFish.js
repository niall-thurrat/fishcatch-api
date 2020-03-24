/**
 * Creates a fish object for embedding in HAL responses
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const halson = require('halson')

const embedFish = (fishCatch) => {
  const embed = halson({
    id: fishCatch._id,
    catcher_name: fishCatch.catcherName,
    species: fishCatch.species,
    catch_created: fishCatch.createdAt
  })
    .addLink('self', `/fish/${fishCatch._id}`)

  return embed
}

// Exports
module.exports = embedFish
