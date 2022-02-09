// Area Routes
import express from 'express'
import { AreaController } from '../controllers/areaController.js'
import { addAllow } from '../controllers/allowHandle.js'

export const router = express.Router()
const areaController = new AreaController()

router
     .route('/')
     .all(addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getAllAreas(req, res, next))

router
     .route('/:id')
     .all(addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getOneArea(req, res, next))

router
     .route('/:id/publishers')
     .all(addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getPublisherWithArea(req, res, next))

router
     .route('/:id/ads')
     .all(addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getAdsForArea(req, res, next))

