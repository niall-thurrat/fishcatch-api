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
const logger = require('morgan')

const app = express()
const port = process.env.PORT

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
app.use(passport.initialize())
require('./config/passport')(passport)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'))

// routes
app.use('/', require('./routes/rootRouter'))
app.use('/users', require('./routes/usersRouter'))
app.use('/fish', passport.authenticate(
  'jwt', { session: false }), require('./routes/fishCatchRouter'))
app.use('/docs', require('./routes/docsRouter'))

// catch 404 errors
app.use('*', (req, res, next) => next(createError(404)))

// custom error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack
  })
})

// run server
app.listen(port, () => console.log(`Server running on port ${port}`))
