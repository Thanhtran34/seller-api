// Account Routes
import express from 'express'
import { AccountController } from '../controllers/accountController.js'
import { ResponseController } from '../controllers/responseController.js'

export const router = express.Router()
const accController = new AccountController()
const resController = new ResponseController()

router
     .route('/register')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .post(
       (req, res, next) => accController.register(req, res, next)
     )

router
     .route('/login')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .post(
       (req, res, next) => accController.login(req, res, next)
     )