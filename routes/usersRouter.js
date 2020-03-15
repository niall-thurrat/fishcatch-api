/**
 * Users routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/usersController')
const passport = require('passport')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.get('/:username', passport.authenticate('jwt', { session: false }),
  controller.authz, controller.viewUser)
router.get('/:username/user-fish', passport.authenticate('jwt', { session: false }),
  controller.authz, controller.viewUserFish)

// Exports.
module.exports = router
