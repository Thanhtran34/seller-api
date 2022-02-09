// Hook Controller
import express from 'express'
import { HookController } from '../controllers/hookController.js'
import { ResponseController } from '../controllers/responseController.js'
import { AccountController } from '../controllers/accountController.js'

export const router = express.Router()
const hookController = new HookController()
const resController = new ResponseController()
const accController = new AccountController()

router
      .route('/')
      .all(resController.addAllow('GET, POST, HEAD, OPTIONS'))
      .get(
      (req, res, next) => accController.authenticateJWT(req, res, next),
      (req, res, next) => hookController.getAllHooks(req, res, next)
      )
      .post(
        (req, res, next) => accController.authenticateJWT(req, res, next),
       (req, res, next) => hookController.createNewHook(req, res, next)
      )

router
      .route('/:id')
      .all(resController.addAllow('GET, PATCH, DELETE, HEAD, OPTIONS'))
      .get(
        (req, res, next) => accController.authenticateJWT(req, res, next),
        (req, res, next) => hookController.getOneHook(req, res, next)
      )
      .patch(
        (req, res, next) => accController.authenticateJWT(req, res, next),
        (req, res, next) => hookController.updateOneHook(req, res, next)
      )
      .delete(
        (req, res, next) => accController.authenticateJWT(req, res, next),
        (req, res, next) => hookController.deleteOneHook(req, res, next)
      )
