/**
 * Fish catch routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/fishCatchController')

router.get('/fish', controller.index)

// router.get('/fish/:fishId', controller.viewFishCatch)

// Exports.
module.exports = router
