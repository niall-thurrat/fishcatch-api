/**
 * Docs router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/docsController')

router.get('/rels/signup', controller.signupDoc)
  .get('/rels/login', controller.loginDoc)
  .get('/rels/user', controller.userDoc)
  .get('/rels/user-fish', controller.userFishDoc)
  // .get('/rels/all-fish', controller.allFishDoc)
  // .get('/rels/one-fish', controller.oneFishDoc)

// Exports
module.exports = router
