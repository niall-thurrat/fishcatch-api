/**
 * Webhook routes
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const authz = require('../middleware/authz')

const addHookController = require('../controllers/hooks/addHook')
const getHookController = require('../controllers/hooks/getHook')
const deleteHookController = require('../controllers/hooks/deleteHook')

router.route('/')
  .post(addHookController.add)
  .get(authz.hook, getHookController.get)
  .delete(authz.hook, deleteHookController.delete)

// Exports
module.exports = router
