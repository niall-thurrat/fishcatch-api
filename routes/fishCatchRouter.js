/**
 * Fish catch router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/fishCatchController')

router.route('/')
  .get(controller.index)
  .post(controller.addFish)

router.route('/:fishId')
  .get(controller.authz, controller.viewFish)
  .put(controller.authz, controller.updateFish)
  .delete(controller.authz, controller.deleteFish)

// Exports.
module.exports = router
