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
const userController = require('../controllers/users/getUser')
const userFishController = require('../controllers/users/getUserFish')

router.post('/signup', signupController.signup)
router.post('/login', loginController.login)
router.get('/:username', passport.authenticate('jwt', { session: false }),
  controller.authz, userController.get)
router.get('/:username/user-fish', passport.authenticate('jwt', { session: false }),
  controller.authz, userFishController.get)

// Exports.
module.exports = router
