// Account Routes
import express from 'express'
import { AccountController } from '../controllers/accountController.js'
import { addAllow } from '../controllers/allowHandle.js'

export const router = express.Router()
const accController = new AccountController()

router
     .route('/login')
     .all(addAllow('POST, HEAD, OPTIONS'))
     .post(
       (req, res, next) => accController.login(req, res, next)
     )