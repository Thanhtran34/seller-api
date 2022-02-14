// Advertisment controller
import { Ad } from '../models/advertisment.js'
import { Publisher } from '../models/publisher.js'
import { LinkController } from './linkController.js'
import { HookController } from './hookController.js'
import { BASE_URL } from '../config/url.js'
import { actions } from '../config/hookAction.js'
import createError from 'http-errors'

const linkController = new LinkController()
const hookController = new HookController()

export class AdsController {
  async getAllAds(req, res, next) {
    try {
      const match = {}
      if (req.query.area) {
        match.area = { $in: req.query.area }
      }
      if (req.query.publisher) {
        match.publisher = { $in: req.query.publisher }
      }
      let limit = parseInt(req.query.$limit)
      if (!limit || limit > 200) {
        limit = 200
      }
      const skip = parseInt(req.query.$skip) || null
      const count = await Ad.count({ ...match })
      const ads = await Ad.find({ ...match }, '-__v -createdAt -updatedAt')
        .sort('updatedAt desc')
        .skip(skip)
        .limit(limit)
        .lean()
        .cache(60)

      let newUrl
      newUrl = req.originalUrl.replace(
        `$limit=${req.query.$limit}`,
        `$limit=${limit}`
      )
      const skipExists = req.originalUrl.indexOf('$skip') !== -1
      if (skipExists) {
        newUrl = newUrl.replace(
          `$skip=${req.query.$skip}`,
          `$skip=${skip + limit}`
        )
      } else {
        const separator = newUrl.indexOf('?') !== -1 ? '&' : '?'
        newUrl = `${newUrl}${separator}$skip=${skip + limit}`
      }

      return res.json({
        totalCount: count,
        itemCount: count > limit ? limit : count,
        next: count > limit ? `${BASE_URL}${newUrl}` : undefined,
        items: ads.map(ad => ({
          ...ad,
          _links: linkController.createLinkForAd(ad),
        })),
      })
    } catch (e) {
      next(e)
    }
  }

  async createAds(req, res, next) {
    try {
      const { id } = req.token
      const publisher = await Publisher.findById(id)
      if (!publisher) {
        createError(403,'Your token is not valid')
      }
      let ad = new Ad({
        ...req.body,
        _id: undefined,
        publisher: publisher._id,
        area: publisher.area,
      })
      ad = await ad.save()
      ad = ad.toObject()

      hookController.runHook(actions.newAd, ad)
      const links = linkController.createLinkForAd(ad)

      return res
        .status(201)
        .header('Location', links.self)
        .json({ ...ad, _links: links })
    } catch (e) {
      next(e)
    }
  }

  async getOneAd(req, res, next) {
    try {
      const ad = await Ad.findById(req.params.id, '-__v')
        .populate('area', 'name population')
        .populate('publisher', 'name')
        .lean()
        .cache(60)
      if (!ad) {
        return next()
      }
      return res.json({
        ...ad,
        _links: linkController.createLinkForAd(ad)
      })
    } catch (e) {
      next(e)
    }
  }

  async updateOneAd(req, res, next) {
    try {
      const publisherId = req.token.id
      let ad = await Ad.findById(req.params.id)
      if (!ad) {
        return next()
      }
      if (ad.publisher !== publisherId) {
        createError(403)
      }
      const ignoreKeys = ['_id', 'publisher', 'area']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        ad[key] = req.body[key]
      })
      ad = await ad.save()

      ad = ad.toObject()
      return res.json({ ...ad, _links: linkController.createLinkForAd(ad) })
    } catch (e) {
      next(e)
    }
  }

  async deleteOneAd(req, res, next) {
    try {
      const publisherId = req.token.id
      const ad = await Ad.findById(req.params.id)
      if (!ad) {
        return next()
      }
      if (ad.publisher !== publisherId) {
        createError(403)
      }
      await ad.remove()
      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  }

}