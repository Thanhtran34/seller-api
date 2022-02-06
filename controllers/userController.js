/**
 * Module for the userController.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import { User } from '../models/user.js'
import createError from 'http-errors'

/**
 * Encapsulates a snippetController.
 */
export class UserController {
  /**
   * Register the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    res.render('user/register')
  }

  /**
   * User can register with his/her email.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerPost (req, res, next) {
    try {
      const user = new User({
        email: req.body.email,
        password: req.body.password
      })
      await user.save()

      req.session.flash = { type: 'success', text: 'Registration is successful.' }
      res.redirect('../user/login')
    } catch (error) {
      console.log(error)
      req.session.flash = { type: 'danger', text: 'Registration failed' }
      res.redirect('./register')
    }
  }

  /**
   * The user log in the page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    res.render('user/login')
  }

  /**
   * The user log in with POST.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} the validation error.
   */
  async loginPost (req, res, next) {
    try {
      const userEmail = req.body.email.toLowerCase()
      const candidatePassword = req.body.password

      const user = await User.findOne({ email: userEmail })

      if (!user) {
        console.log('User not found')
        req.session.flash = { type: 'danger', text: 'user not found' }
        res.redirect('./login')
      }

      const isAuthenticated = await user.comparePassword(candidatePassword)
      if (isAuthenticated) {
        req.session.user = user._id
        res.redirect('../snippets/')
      } else {
        req.session.flash = { type: 'danger', text: 'Login failed' }
        res.redirect('./login')
      }
    } catch (error) {
      console.log(error)
      req.session.flash = { type: 'danger', text: 'Login failed' }
      res.redirect('./login')
    }
  }

  /**
   * Logs out the currently logged in user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      delete req.session.user
      if (!req.session.user) {
        req.session.flash = { type: 'success', text: 'Logout successful.' }
        res.redirect('..')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Check if the user is authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticate (req, res, next) {
    try {
      if (req.session.user) {
        // authenticated
        next()
      } else {
        // not authenticated
        next(createError(404, 'Login Required!'))
      }
    } catch (error) {
      next(error)
    }
  }
}
