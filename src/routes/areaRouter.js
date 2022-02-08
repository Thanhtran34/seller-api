// Area Routes
import express from 'express'
import { AreaController } from '../controllers/areaController'
import { ResponseController } from '../controllers/responseController'

export const router = express.Router()
const areaController = new AreaController()
const resController = new ResponseController()

router
     .route('/')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get(areaController.getAllAreas)

router
     .route('/:id')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get(areaController.getOneArea)

router
     .route('/:id/publishers')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get(areaController.getPublisherWithArea)

router
     .route('/:id/ads')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get(areaController.getAdsForArea)

