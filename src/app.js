/**
 * The starting point of the API.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { logger } from './config/logger.js'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import { handleAllow } from './controllers/allowHandle.js'

/**
 * The main function of the application.
 */
const main = async () => {
  await connectDB()

  const app = express()
  app.use(helmet())
 
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }
  app.use(express.json())

  app.use(express.urlencoded({ extended: false }))

  app.use(compression())
  
  app.use(cors({ methods: [], preflightContinue: true }))
  
  // Register router
  app.use('/', router)

  // Handle OPTIONS and 405 allow headers
  app.use(handleAllow)
  
  // Handle 404
  app.use((req, res) => {
  return res.status(404).json({ error: { code: 404, message: 'Not found' } })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    logger.info(`API is running at port ${process.env.PORT}`)
    logger.info('Press Ctrl-C to terminate...')
  })
}

main().catch(console.error)
