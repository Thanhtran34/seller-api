
 // The starting point of the API.
 
 import express from 'express'
 import cors from 'cors'
 import helmet from 'helmet'
 import logger from 'morgan'
 import { router } from './routes/router.js'
 import { connectDB } from './config/mongoose.js'
 
 /**
  * The main function of the api
  */
 const main = async () => {
   await connectDB()
 
   const app = express()
 
   app.use(helmet())
 
   app.use(cors())
 
   app.use(logger('dev'))
 
   app.use(express.json({ limit: '500kb' }))
 
   app.use('/', router)
 
   app.use(function (err, req, res, next) {
     err.status = err.status || 500
 
     if (req.app.get('env') !== 'development') {
       res
         .status(err.status)
         .json({
           status: err.status,
           message: err.message
         })
       return
     }
 
     return res
       .status(err.status)
       .json({
         status: err.status,
         message: err.message,
         innerException: err.innerException,
         stack: err.stack
       })
   })
 
   app.listen(process.env.PORT, () => {
     console.log(`Server running at http://localhost:${process.env.PORT}`)
     console.log('Press Ctrl-C to terminate...')
   })
 }
 
 main().catch(console.error)
 