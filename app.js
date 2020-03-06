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
const port = process.env.PORT

const app = express()

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// routes
app.use('/', require('./routes/indexRouter'))
app.use('/fish', require('./routes/fishCatchRouter'))
app.use('/users', require('./routes/usersRouter'))

// run server
app.listen(port, () => console.log(`Server running on port ${port}`))
