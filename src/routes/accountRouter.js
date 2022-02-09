// Account Routes
import express from 'express'
import { AccountController } from '../controllers/accountController.js'
import { addAllow } from '../controllers/allowHandle.js'

export const router = express.Router()
const accController = new AccountController()

router
     .route('/register')
     .all(addAllow('GET, HEAD, OPTIONS'))
     .post(
       (req, res, next) => accController.register(req, res, next)
     )

router
     .route('/login')
     .all(resController.addAllow('GET, HEAD, OPTIONS'))
     .post(
       (req, res, next) => accController.login(req, res, next)
     )