/**
 * Users routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const passport = require('passport')

const controller = require('../controllers/usersController')
const signupController = require('../controllers/users/signup')
const loginController = require('../controllers/users/login')
const getUserController = require('../controllers/users/getUser')

router.post('/signup', signupController.signup)
router.post('/login', loginController.login)
router.get('/:username', passport.authenticate('jwt', { session: false }),
  controller.authz, getUserController.get)
router.get('/:username/user-fish', passport.authenticate('jwt', { session: false }),
  controller.authz, controller.viewUserFish)

// Exports.
module.exports = router
