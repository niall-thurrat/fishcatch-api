/**
 * Docs router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/docsController')

router.route('/rels/signup')
  .get(controller.signupDoc)

// Exports.
module.exports = router
