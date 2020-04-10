/**
 * Mongoose configuration.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
require('dotenv').config()

/**
 * Creates connection to mongoDB database.
 *
 * @returns {Promise}
*/
module.exports.run = async () => {
  // Get Mongoose to use the global promise library.
  mongoose.Promise = global.Promise

  // Bind mongoose connection to events for notifications
  mongoose.connection.on('connected', () =>
    console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err =>
    console.error(`Mongoose connection error has occured: ${err}`))
  mongoose.connection.on('disconnected', () =>
    console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  const dbUrl = process.env.MONGODB_URI ||
    process.env.DEV_MONGODB_URL

  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }

  // Connect to the server.
  return mongoose.connect(dbUrl, dbOptions)
}
