/**
 * Fish catch router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const authz = require('../middleware/authz')

const getAllFishController = require('../controllers/fishCatches/getAllFish')
const addFishController = require('../controllers/fishCatches/addFish')
const getOneFishController = require('../controllers/fishCatches/getOneFish')
const controller = require('../controllers/fishCatchController')

router.route('/')
  .get(getAllFishController.get)
  .post(addFishController.add)

router.route('/:fishId')
  .get(authz.fish, getOneFishController.get)
  .patch(authz.fish, controller.updateFish)
  .delete(authz.fish, controller.deleteFish)

// Exports
module.exports = router
