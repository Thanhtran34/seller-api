// The routes

import express from 'express'
import { router as adsRouter } from './adsRouter.js'
import { router as accountRouter } from './accountRouter.js'
import { router as areaRouter } from './areaRouter.js'
import { router as hookRouter } from './hookRouter.js'
import { router as publisherRouter } from './publisherRouter.js'

export const router = express.Router()

router.use('/auth', accountRouter)
router.use('/ads', adsRouter)
router.use('/publishers', publisherRouter)
router.use('/areas', areaRouter)
router.use('/hooks', hookRouter)


router.use('*', (req, res, next) => {
  const error = new Error()
  error.status = 404
  error.message = 'Not Found'
  next(error)
})
