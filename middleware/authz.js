
/**
 * Authorization middleware
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a lot of help from Frank Atukunda for this one:
 *   https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122
 */

'use strict'

const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authz = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  const data = jwt.verify(token, process.env.JWT_KEY)

  try {
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.token = token

    next()
  } catch (error) {
    res.status(403).send({ error: 'Not authorized to access this resource' })
  }
}
module.exports = authz
