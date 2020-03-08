/**
 * Users routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/usersController')
const authz = require('../middleware/authz')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.get('/:username', authz, controller.viewUser)
router.post('/:username/logout', authz, controller.logoutUser)

// Exports.
module.exports = router
