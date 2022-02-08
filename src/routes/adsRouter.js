// Advertisement routes
import express from 'express'
import { AdsController } from '../controllers/adsController'
import { AccountController } from '../controllers/accountController.js'
import { ResponseController } from '../controllers/responseController.js'

export const router = express.Router()
const adController = new AdsController()
const accController = new AccountController()
const resController = new ResponseController()

router
    .route('/')
    .all(resController.addAllow('GET, POST, HEAD, OPTIONS'))
    .get(adController.getAllAds)
    .post(accController.authenticateJWT, adController.createAds)

router
    .route('/:id')
    .all(resController.addAllow('GET, PATCH, DELETE, HEAD, OPTIONS'))
    .get(adController.getOneAd)
    .patch(accController.authenticateJWT, adController.updateOneAd)
    .delete(accController.authenticateJWT, adController.deleteOneAd)