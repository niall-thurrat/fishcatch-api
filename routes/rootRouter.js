/**
 * API root route
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/rootController')

router.get('/', controller.getRoot)

// Exports.
module.exports = router
