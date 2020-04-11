/**
 * The starting point of the application.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const mongoose = require('./config/mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const cacheControl = require('express-cache-controller')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT || 3000

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// rate-limiting config
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// security middleware
app.use(limiter)
app.use(helmet())

// middleware
app.use(passport.initialize())
require('./config/passport')(passport)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cacheControl())

if (app.settings.env === 'development') {
  const logger = require('morgan')
  app.use(logger('dev'))
}

// routes
app.use('/', require('./routes/rootRouter'))
app.use('/users', require('./routes/usersRouter'))
app.use('/fish', passport.authenticate(
  'jwt', { session: false }), require('./routes/fishCatchRouter'))
app.use('/hooks', passport.authenticate(
  'jwt', { session: false }), require('./routes/hooksRouter'))
app.use('/docs', require('./routes/docsRouter'))

// catch 404 errors
app.use('*', (req, res, next) => next(createError(404)))

// custom error handler
app.use((error, req, res, next) => {
  const stack = app.settings.env === 'development' ? error.stack : ''

  res.status(error.status || 500)
  res.json({
    status: error.status,
    message: error.message,
    stack: stack
  })
})

// run server
app.listen(port, () => console.log(`Server running on port ${port}`))
