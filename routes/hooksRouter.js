/**
 * Webhook routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/hooksController')

router.post('/', controller.add)

// Exports.
module.exports = router
