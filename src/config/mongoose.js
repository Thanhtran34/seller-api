/**
 * Mongoose configuration.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import { logger } from './logger.js'

cachegoose(mongoose)

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise} Resolves to this if connection succeeded.
 */
export const connectDB = async () => {
  // Bind connection to events (to get notifications).
  mongoose.connection.on('connected', () => logger.info('Mongoose connection is open.'))
  mongoose.connection.on('error', err => logger.error(`Mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => logger.info('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.info('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  const dbConnectionString = process.env.DB_CONNECTION_STRING

  // Check if .env file exists
  if (!dbConnectionString)
    throw new Error('You need to provide database connection string in .env file.')

  // Connect to the server.
  return mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
