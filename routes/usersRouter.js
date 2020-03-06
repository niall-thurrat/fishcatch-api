/**
 * Users routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/usersController')

router.post('/signup', controller.signup)
router.post('/login', controller.login)

// Exports.
module.exports = router
