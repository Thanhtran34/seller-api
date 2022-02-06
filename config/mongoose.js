
 // Mongoose configuration.

 import mongoose from 'mongoose'
 import cachegoose from 'cachegoose'
 import { logger } from './logger.js'

 cachegoose(mongoose)
// Establishes a connection to a database.
 export const connectDB = async () => {
   mongoose.connection.on('connected', () => logger.info('Mongoose connection is open.'))
   mongoose.connection.on('error', err => logger.error(`Mongoose connection error has occurred: ${err}`))
   mongoose.connection.on('disconnected', () => logger.info('Mongoose connection is disconnected.'))
 
   process.on('SIGINT', () => {
     mongoose.connection.close(() => {
       logger.info('Mongoose connection is disconnected due to application termination.')
       process.exit(0)
     })
   })

   const dbConnectionString = process.env.DB_CONNECTION_STRING
   const port = process.env.PORT
   console.log(dbConnectionString)
   console.log(port)

   // Check that .env file with key exists.
   if (!dbConnectionString)
     throw new Error('You need the database connection string in .env file')

   logger.info('Establishing a Mongoose connection')
   return mongoose.connect(process.env.dbConnectionString, {
     useCreateIndex: true,
     useNewUrlParser: true,
     useUnifiedTopology: true
   })
 }
 