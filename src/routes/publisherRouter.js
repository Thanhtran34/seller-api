// Publisher Routes
import express from 'express'
import { PublisherController } from '../controllers/publisherController.js'
import { addAllow } from '../controllers/allowHandle.js'
import { AccountController } from '../controllers/accountController.js'

export const router = express.Router()
const publisherController = new PublisherController()
const accController = new AccountController()

router
     .route('/')
     .all(addAllow('GET, POST, HEAD, OPTIONS'))
     .get((req, res, next) => publisherController.getAllPublishers(req, res, next))
     .post(
      (req, res, next) => accController.validateInput(req, res, next),
      (req, res, next) => publisherController.createNewPublisher(req, res, next)
     )

router
     .route('/:id')
     .all(addAllow('GET, PUT, PATCH, DELETE, HEAD, OPTIONS'
     ))
     .get(
      (req, res, next) => publisherController.getOnePublisher(req, res, next)
     )
     .put(
       (req, res, next) => accController.authenticateJWT(req, res, next),
       (req, res, next) => accController.validateInput(req, res, next),
       (req, res, next) => publisherController.updateOnePublisher(req, res, next)
       )
     .delete(
      (req, res, next) => accController.authenticateJWT(req, res, next),
      (req, res, next) => publisherController.deleteOnePublisher(req, res, next)
     )

router
    .route('/:id/details')
    .all(addAllow('GET,HEAD, OPTIONS'))
    .get(
      (req, res, next) => accController.authenticateJWT(req, res, next),
      (req, res, next) => publisherController.getDetailOfPublisher(req, res, next)
    )

    router
    .route('/:id/ads')
    .all(addAllow('GET,HEAD, OPTIONS'))
    .get(
      (req, res, next) => publisherController.getAdsOfPublisher(req, res, next)
    )