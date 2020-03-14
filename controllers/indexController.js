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
    console.log('HOME CONTROLLER CALLED')
    res.status(200).json({ message: 'this is where i guess i\'ll put all the links to the site!!!' })
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = indexController
