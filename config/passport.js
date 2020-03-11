/**
 * Passport configuration.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 *  * @credits got a bit of help from Chris Rutherford on this one:
 * https://medium.com/@therealchrisrutherford/nodejs-authentication-with-passport-and-jwt-in-express-3820e256054f
 */

'use strict'

const { Strategy, ExtractJwt } = require('passport-jwt')

const secret = process.env.SECRET || 'some other secret as default'

const User = require('../models/userModel')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

module.exports = passport => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, {
              id: user.id,
              name: user.name,
              username: user.username,
              emailAddress: user.emailAddress
            })
          }
          return done(null, false)
        }).catch(err => console.error(err))
    })
  )
}
