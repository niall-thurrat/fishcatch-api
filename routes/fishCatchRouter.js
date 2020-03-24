/**
 * Fish catch router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()

const controller = require('../controllers/fishCatchController')
const authz = require('../middleware/authz')

router.route('/')
  .get(controller.viewAllFish)
  .post(controller.addFish)

router.route('/:fishId')
  .get(authz.fish, controller.viewFish)
  .patch(authz.fish, controller.updateFish)
  .delete(authz.fish, controller.deleteFish)

// Exports
module.exports = router
