/**
 * Module for the snippetController.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import { Snippet } from '../models/snippet.js'
import moment from 'moment'
import createError from 'http-errors'

/**
 * Encapsulates a snippetController.
 */
export class SnippetController {
  /**
   * Renders the index page that displays all code snippets in mongodb.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express middleware function.
   */
  async index (req, res, next) {
    try {
      const locals = {
        snippetItems: (await Snippet.find({}))
          .map(snippetItem => ({
            id: snippetItem._id,
            dateCreated: moment(snippetItem.dateCreated).format('YYYY-MM-DD HH:mm'),
            dateUpdated: (moment(snippetItem.dateUpdated).isValid()) ? moment(snippetItem.dateUpdated).format('YYYY-MM-DD HH:mm') : 'NA',
            title: snippetItem.title,
            code: snippetItem.code,
            author: snippetItem.author
          }))
      }
      res.render('snippets/index', { locals })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the page for new code snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    res.render('snippets/create')
  }

  /**
   * Creates a new code snippet in the database.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   *
   */
  async createPost (req, res, next) {
    try {
      const userId = req.session.user
      const snippet = new Snippet({
        title: req.body.title,
        code: req.body.code,
        author: userId
      })

      await snippet.save()

      req.session.flash = { type: 'success', text: 'Snippet was submited successfully.' }
      res.redirect('.')
    } catch (error) {
      next(error)
      res.redirect('./create')
    }
  }

  /**
   * Renders the page for editing a code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async edit (req, res, next) {
    try {
      const snippetItem = await Snippet.findOne({ _id: req.params.id })

      if (!snippetItem) {
        console.log('snippet not found')
        req.session.flash = { type: 'danger', text: 'Snippet not found.' }
        res.redirect('./login')
      }
      const locals = {
        id: snippetItem._id,
        dateUpdated: snippetItem.dateUpdated,
        dateCreated: snippetItem.dateCreated,
        title: snippetItem.title,
        code: snippetItem.code,
        author: snippetItem.author
      }

      res.render('snippets/edit', { locals })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'The file could not open.' }
      res.redirect('..')
    }
  }

  /**
   * Updates a code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async editPost (req, res, next) {
    try {
      const snippet = await Snippet.updateOne({ _id: req.params.id }, {
        $set: {
          title: req.body.title,
          code: req.body.code,
          dateUpdated: moment(new Date())
        }
      })

      if (snippet.nModified === 1) {
        req.session.flash = { type: 'success', text: 'Snippet updated successfully.' }
      } else {
        req.session.flash = { type: 'danger', text: 'This snippet could not update' }
      }

      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'This snippet could not update.' }
      res.redirect('.')
    }
  }

  /**
   * Renders the page to delete a code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async remove (req, res, next) {
    try {
      const snippetItem = await Snippet.findOne({ _id: req.params.id })

      if (!snippetItem) {
        console.log('snippet not found')
        req.session.flash = { type: 'danger', text: 'Snippet not found.' }
        res.redirect('./login')
      }

      const locals = {
        id: snippetItem._id,
        title: snippetItem.title,
        code: snippetItem.code,
        author: snippetItem.author
      }

      res.render('snippets/delete', { locals })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'This snippet could not open.' }
      res.redirect('..')
    }
  }

  /**
   * Deletes a code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await Snippet.deleteOne({ _id: req.params.id })
      req.session.flash = { type: 'success', text: 'Snippet deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'This snippet could not be deleted.' }
      res.redirect('./delete')
    }
  }

  /**
   * Check if the user is authorized.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authorize (req, res, next) {
    try {
      const snippetItem = await Snippet.findOne({ _id: req.params.id })
      const author = snippetItem.author
      const user = req.session.user
      if (author.localeCompare(user) === 0) {
        // authorized
        next()
      } else {
        // not authorized
        next(createError(403, 'Forbidden'))
      }
    } catch (error) {
      next(error)
    }
  }
}
