/**
 * Mongoose configuration.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const CONNECTION_STRING = 'mongodb://first-admin:Administrati0n@cluster0-shard-00-00-ggj6m.mongodb.net:27017,' +
    'cluster0-shard-00-01-ggj6m.mongodb.net:27017,cluster0-shard-00-02-ggj6m.mongodb.net:27017/test?ssl=true&' +
    'replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
    // ////////////////////////////////////////////////////////////// put password in a separate file and change db password

/**
 * Creates connection to mongoDB database.
 *
 * @returns {Promise}
*/
module.exports.run = async () => {
  // Get Mongoose to use the global promise library.
  mongoose.Promise = global.Promise

  // Bind mongoose connection to events for notifications
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occured: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  const options = { useNewUrlParser: true, useUnifiedTopology: true }

  // Connect to the server.
  return mongoose.connect(CONNECTION_STRING, options)
}
