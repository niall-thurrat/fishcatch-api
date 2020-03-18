/**
 * Get an integer from a string
 * Useful for parsing integers from queries in URIs!
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const getQueryInt = (value, defaultVal) => {
  if (value === undefined) {
    return defaultVal
  }

  value = parseInt(value, 10)

  if (isNaN(value)) {
    return defaultVal
  }
  return value
}

// Exports
module.exports = getQueryInt
