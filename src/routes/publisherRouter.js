// Publisher Routes
import express from 'express'
import { PublisherController } from '../controllers/publisherController.js'
import { ResponseController } from '../controllers/responseController.js'
import { AccountController } from '../controllers/accountController.js'

export const router = express.Router()
const publisherController = new PublisherController()
const resController = new ResponseController()
const accController = new AccountController()

router
     .route('/')
     .all(resController.addAllow('GET, POST, HEAD, OPTIONS'))
     .get((req, res, next) => publisherController.getAllPublishers(req, res, next))
     .post(
      (req, res, next) => publisherController.createNewPublisher(req, res, next)
     )

router
     .route('/:id')
     .all(resController.addAllow('GET, PATCH, DELETE, HEAD, OPTIONS'
     ))
     .get(
      (req, res, next) => publisherController.getOnePublisher(req, res, next)
     )
     .patch(
       (req, res, next) => accController.authenticateJWT(req, res, next),
       (req, res, next) => publisherController.updateOnePublisher(req, res, next)
       )
     .delete(
      (req, res, next) => accController.authenticateJWT(req, res, next),
      (req, res, next) => publisherController.deleteOnePublisher(req, res, next)
     )

router
    .route('/:id/details')
    .all(resController.addAllow('GET,HEAD, OPTIONS'))
    .get(
      (req, res, next) => accController.authenticateJWT(req, res, next),
      (req, res, next) => publisherController.getDetailOfPublisher(req, res, next)
    )

    router
    .route('/:id/ads')
    .all(resController.addAllow('GET,HEAD, OPTIONS'))
    .get(
      (req, res, next) => publisherController.getAdsOfPublisher(req, res, next)
    )