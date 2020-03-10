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
router.get('/:username', controller.viewUser)
router.post('/:username/logout', controller.logoutUser)

// Exports.
module.exports = router
