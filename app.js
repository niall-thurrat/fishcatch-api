/**
 * The starting point of the application.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const mongoose = require('./config/mongoose')
const bodyParser = require('body-parser')
const logger = require('morgan')

const app = express()
const port = process.env.PORT

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
require('./middleware/auth')
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true })) /// is extended really needed?
app.use(bodyParser.json())

// main routes
app.use('/', require('./routes/indexRouter'))
app.use('/fish', require('./routes/fishCatchRouter'))
app.use('/users', require('./routes/usersRouter'))

// Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({ error: err })
})

// run server
app.listen(port, () => console.log(`Server running on port ${port}`))
