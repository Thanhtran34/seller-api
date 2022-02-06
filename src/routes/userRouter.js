/**
 * The user routes.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

import express from 'express'
import { UserController } from '../controllers/userController.js'

export const router = express.Router()
const controller = new UserController()

// Register the user.
router.get('/register', controller.register)
router.post('/register', controller.registerPost)

// GET, POST /login user
router.get('/login', controller.login)
router.post('/login', controller.loginPost)
// GET, POST /logout user
router.get('/logout', controller.logout)
