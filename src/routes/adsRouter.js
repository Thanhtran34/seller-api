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
    .get((req, res, next)=> adController.getAllAds(req, res, next))
    .post(
        (req, res, next) => accController.authenticateJWT(req, res, next),
        (req, res, next) => adController.createAds(req, res, next)
        )

router
    .route('/:id')
    .all(resController.addAllow('GET, PATCH, DELETE, HEAD, OPTIONS'))
    .get((req, res, next) => adController.getOneAd(req, res, next))
    .patch(
        (req, res, next) => accController.authenticateJWT(req, res, next), 
        (req, res, next) => adController.updateOneAd(req, res, next)
        )
    .delete(
        (req, res, next) => accController.authenticateJWT(req, res, next), 
        (req, res, next) => adController.deleteOneAd(req, res, next)
        )