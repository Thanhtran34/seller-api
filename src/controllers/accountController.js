// Authentication controller
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import isEmpty from 'is-empty'
import Validator from 'validator'
import { BASE_URL } from '../config/url.js'
import { Publisher } from '../models/publisher.js'
import { LinkController } from './linkController.js'

const linkController = new LinkController()

export class AccountController {
  validateInput (req, res, next) {
    try {
      const errors = {}
      req.body.email = !isEmpty(req.body.email) ? req.body.email : ''
      req.body.password = !isEmpty(req.body.password) ? req.body.password : ''

      if (Validator.isEmpty(req.body.email)) {
        errors.email = 'Email is required'
      } else if (!Validator.isEmail(req.body.email)) {
        errors.email = 'Not a valid email'
      }

      if (Validator.isEmpty(req.body.password)) {
        errors.password = 'Password is required'
      }

      if (!Validator.isStrongPassword(req.body.password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
        errors.password = 'Password must be minst 8 characters long with minst 1 lowercase, 1 uppercase, 1 number and 1 special symbol'
      }

      if (!isEmpty(errors)) {
        res.status(422).json(errors)
      } else next()
    } catch (err) {
      next(err)
    }
  }

  async register(req, res, next) {
    try {
      const user = await Publisher.insert({
        name: req.body.name,
        email: req.body.email,
        area: req.body.area,
        password: req.body.password,
      })

      res
        .status(201)
        .header('Cache-Control', 'no-store')
        .header('Pragma', 'no-cache')
        .json({ 
          id: user._id,
        _links: linkController.createLinkForLogin()
        })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.innerException = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }

      next(err)
    }
  }

  async login(req, res, next) {
    try {
      const user = await Publisher.authenticate(
        req.body.email,
        req.body.password
      )

      const payload = { 
        email: user.email,
        password: user.password
      }

      // Create the access token with the shorter lifespan.
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: 600,
      })

      res
        .status(200)
        .header('Cache-Control', 'no-store')
        .header('Pragma', 'no-cache')
        .json({
          accessToken: token,
          tokenType: 'Bearer',
          expiresIn: 600,
          _links: linkController.createLinkForPublisher(user),
        });
    } catch (error) {
      // Authentication failed.
      next(createError(401, 'Authorization needed'))
    }
  }

  authenticateJWT(req, res, next) {
    const authorization = req.headers.authorization?.split('')

    if (authorization?.[0] !== 'Bearer') {
      next(createError(401, 'Bearer token is missing'));
      return
    }

    try {
      const token = authorization[1]
      const payload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      )
      req.token = payload

      next()
    } catch (err) {
      const authUrl = BASE_URL + '/auth/login'
      return res
        .status(401)
        .header('WWW-Authenticate', 'Bearer')
        .json({
          error: { code: 401, message: e.message },
          auth: {
            link: authUrl,
            method: 'POST',
            body: {
              email: 'registered email',
              password: 'registered password'
            }
          }
        })
    }
  }
}
