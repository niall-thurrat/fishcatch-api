/**
 * home route
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/indexController')

router.get('/', controller.index)

// Exports.
module.exports = router
