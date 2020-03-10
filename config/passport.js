/**
 * Passport configuration.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a little help from Chris Rutherford for this one:
 * https://medium.com/@therealchrisrutherford/nodejs-authentication-with-passport-and-jwt-in-express-3820e256054f
 */

'use strict'

const User = require('./models/user')

const secret = process.env.SECRET

const { Strategy, ExtractJwt } = require('passport-jwt')
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
              email: user.email
            })
          }
          return done(null, false)
        }).catch(err => console.error(err))
    })
  )
}
