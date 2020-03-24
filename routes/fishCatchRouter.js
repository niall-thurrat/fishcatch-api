/**
 * Fish catch router
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const authz = require('../middleware/authz')

const getAllFishController = require('../controllers/fish/getAllFish')
const addFishController = require('../controllers/fish/addFish')
const getOneFishController = require('../controllers/fish/getOneFish')
const editFishController = require('../controllers/fish/editFish')
const deleteFishController = require('../controllers/fish/deleteFish')

router.route('/')
  .get(getAllFishController.get)
  .post(addFishController.add)

router.route('/:fishId')
  .get(authz.fish, getOneFishController.get)
  .patch(authz.fish, editFishController.edit)
  .delete(authz.fish, deleteFishController.delete)

// Exports
module.exports = router
