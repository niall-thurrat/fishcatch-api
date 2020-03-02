/**
 * index controller. Main point of entry to API.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const indexController = {}

indexController.index = async (req, res, next) => {
  try {
    console.log('IM WORKING!!!')
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = indexController
