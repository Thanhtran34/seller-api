// Controller for publisher
import { Ad } from '../models/advertisment.js'
import { Publisher } from '../models/publisher.js'
import { LinkController } from './linkController.js'
import { HookController } from './hookController.js'
import createError from 'http-errors'

const actions = {
  newAd: 'newAd',
  newPublisher: 'newPublisher',
}

export class PublisherController {
  async getAllPublishers(req, res, next) {
    try {
      const match = {}
      if (req.query.area) {
        match.area = { $in: req.query.area }
      }
      if (req.query.id) {
        match._id = { $in: req.query.id }
      }
      const publishers = await Publisher.find({ ...match }, 'name area')
        .lean()
        .cache(60)
      return res.json({
        items: publishers.map(p => {
          return {
            ...p,
            _links: LinkController.createLinkForPublisher(p),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  }

  async createNewPublisher(req, res, next) {
    try {
      let publisher = new Publisher({ ...req.body, _id: undefined })
      publisher = await publisher.save()
      const links = LinkController.createLinkForPublisher(publisher)
      publisher = publisher.toObject()
      HookController.runHook(actions.newPublisher, publisher)
      return res
        .status(201)
        .header('Location', links.self)
        .json({
          ...publisher,
          _links: links,
        })
    } catch (e) {
      next(e)
    }
  }

  async getOnePublisher(req, res, next) {
    try {
      const publisher = await Publisher.findById(req.params.id, 'name')
        .populate('area', 'name population')
        .lean()
        .cache(60)
      if (!publisher) {
        return next()
      }
      return res.json({
        ...publisher,
        _links: LinkController.createLinkForPublisher(publisher),
      })
    } catch (e) {
      next(e)
    }
  }

  async updateOnePublisher(req, res, next) {
    try {
      const { id } = req.token
      if (req.params.id !== id) {
        createError(403)
      }
      let publisher = await Publisher.findById(req.params.id)
      if (!publisher) {
        return next()
      }
      const ignoreKeys = ['_id']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        publisher[key] = req.body[key]
      })
      await publisher.save()
      publisher = publisher.toObject()
      return res.json({
        ...publisher,
        _links: LinkController.createLinkForPublisher(publisher),
      })
    } catch (e) {
      next(e)
    }
  }

  async deleteOnePublisher(req, res, next) {
    try {
      const { id } = req.token
      if (req.params.id !== id) {
        createError(403)
      }
      const doc = await Publisher.findByIdAndDelete(id)
      if (!doc) {
        return next()
      }

      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  }

  async getDetailOfPublisher(req, res, next) {
    try {
      const { id } = req.token
      if (req.params.id !== id) {
        createError(403)
      }
      const publisher = await Publisher.findById(id, '-password -__v')
        .populate('area', 'name population')
        .lean()
        .cache(60)
      if (!publisher) {
        next()
      }
      return res.json({
        ...publisher,
        _links: LinkController.createLinkForPublisher(publisher),
      })
    } catch (e) {
      next(e)
    }
  }

  async getAdsOfPublisher(req, res, next) {
    try {
      const ads = await Ad.find({ publisher: req.params.id })
        .lean()
        .cache(60)
      return res.json({
        items: ads.map(ad => {
          return {
            ...ad,
            _links: LinkController.createLinkForAd(ad),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  }
}