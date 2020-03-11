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
const cookieParser = require('cookie-parser')
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
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

// routes
app.use('/', require('./routes/indexRouter'))
app.use('/fish', require('./routes/fishCatchRouter'))
app.use('/users', require('./routes/usersRouter'))

// run server
app.listen(port, () => console.log(`Server running on port ${port}`))
