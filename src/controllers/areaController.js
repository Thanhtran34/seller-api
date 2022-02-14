// Controller for area
import { Ad } from '../models/advertisment.js'
import { Publisher } from '../models/publisher.js'
import { Area } from '../models/area.js'
import { LinkController } from './linkController.js'

const linkController= new LinkController()
export class AreaController {
  async getAllAreas(req, res, next) {
    try {
      const areas = await Area.find({}, '-__v -createdAt -modifiedAt')
        .lean()
        .cache(60)
      return res.json({
        items: areas.map(a => ({
          ...a,
          _links: linkController.createLinkForArea(a),
        })),
      })
    } catch (e) {
      next(e)
    }
  }

  async getOneArea(req, res, next) {
    try {
      const area = await Area.findById(req.params.id, '-__v')
        .lean()
        .cache(60)
      if (!area) {
        return next()
      }
      return res.json({
        ...area,
        _links: linkController.createLinkForArea(area),
      })
    } catch (e) {
      next(e)
    }
  }

  async getPublisherWithArea(req, res, next) {
    try {
      const publishers = await Publisher.find(
        { area: req.params.id },
        'name area'
      )
        .lean()
        .cache(60)
      return res.json({
        items: publishers.map(p => {
          return {
            ...p,
            _links: linkController.createLinkForPublisher(p),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  }

  async getAdsForArea(req, res, next) {
    try {
      const ads = await Ad.find(
        { area: req.params.id },
        '-__v -createdAt -updatedAt'
      )
        .lean()
        .cache(60)
      return res.json({
        items: ads.map(ad => {
          return {
            ...ad,
            _links: linkController.createLinkForAd(ad),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  }
}