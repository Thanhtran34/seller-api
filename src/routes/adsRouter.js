// Advertisement routes
import express from 'express'
import { AdsController } from '../controllers/adsController.js'
import { AccountController } from '../controllers/accountController.js'
import { addAllow } from '../controllers/allowHandle.js'

export const router = express.Router()
const adController = new AdsController()
const accController = new AccountController()

router
    .route('/')
    .all(addAllow('GET, POST, HEAD, OPTIONS'))
    .get((req, res, next)=> adController.getAllAds(req, res, next))
    .post(
        (req, res, next) => accController.authenticateJWT(req, res, next),
        (req, res, next) => adController.createAds(req, res, next)
        )

router
    .route('/:id')
    .all(addAllow('GET, PATCH, DELETE, HEAD, OPTIONS'))
    .get((req, res, next) => adController.getOneAd(req, res, next))
    .patch(
        (req, res, next) => accController.authenticateJWT(req, res, next), 
        (req, res, next) => adController.updateOneAd(req, res, next)
        )
    .delete(
        (req, res, next) => accController.authenticateJWT(req, res, next), 
        (req, res, next) => adController.deleteOneAd(req, res, next)
        )