/**
 * Docs router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()

const signupDocController = require('../controllers/docs/signupDoc')
const loginDocController = require('../controllers/docs/loginDoc')
const userController = require('../controllers/docs/userDoc')
const userFishController = require('../controllers/docs/userFishDoc')
const allFishController = require('../controllers/docs/allFishDoc')
const oneFishController = require('../controllers/docs/oneFishDoc')
const hooksController = require('../controllers/docs/hooksDoc')

router.get('/rels/signup', signupDocController.get)
  .get('/rels/login', loginDocController.get)
  .get('/rels/user', userController.get)
  .get('/rels/user-fish', userFishController.get)
  .get('/rels/all-fish', allFishController.get)
  .get('/rels/one-fish', oneFishController.get)
  .get('/rels/hooks', hooksController.get)

// Exports
module.exports = router
