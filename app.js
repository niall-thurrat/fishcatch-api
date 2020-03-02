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

const app = express()

// connect to mongoDB via mongoose
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// routes
app.use('/', require('./routes/indexRouter'))
app.use('/fish', require('./routes/fishCatchRouter'))

// run server
app.listen(3000, () => console.log('Server running at http://localhost:3000/'))
