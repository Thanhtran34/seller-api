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
     .get((req, res, next) => areaController.getAllAreas(req, res, next))

router
     .route('/:id')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getOneArea(req, res, next))

router
     .route('/:id/publishers')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getPublisherWithArea(req, res, next))

router
     .route('/:id/ads')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .get((req, res, next) => areaController.getAdsForArea(req, res, next))

