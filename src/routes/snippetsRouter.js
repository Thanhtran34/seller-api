/**
 * Snippet routes.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

import express from 'express'
import { SnippetController } from '../controllers/snippetsController.js'
import { UserController } from '../controllers/userController.js'

export const router = express.Router()

const controller = new SnippetController()
const userController = new UserController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)

// create snippet
router.get('/create', userController.authenticate, controller.create)
router.post('/create', userController.authenticate, controller.createPost)

// edit snippet
router.get('/edit/:id', userController.authenticate, controller.authorize, controller.edit)
router.post('/edit/:id', userController.authenticate, controller.authorize, controller.editPost)

// delete snippet
router.get('/delete/:id', userController.authenticate, controller.authorize, controller.remove)
router.post('/delete/:id', userController.authenticate, controller.authorize, controller.delete)
