// hook controller
import axios from 'axios'
import Cryptr from 'cryptr'
import createError from 'http-errors'
import { Publisher } from '../models/publisher.js'
import { LinkController } from './linkController.js'
import { Hook } from '../models/hook.js'

const cryptr = new Cryptr('myTotalySecretKey')
const linkController = new LinkController()
export class HookController {
  //Sends payload as JSON via POST all subscribers with
  async runHook(action, payload) {
    const hooks = await Hook.find();
    const promises = [];
    hooks
      .filter((hook) => hook.action === action)
      .forEach((hook) => promises.push(axios.post(hook.callback, payload)));
    await Promise.all(promises);
  }

  async getAllHooks(req, res, next) {
    try {
      const { id } = req.token

      const hooks = await Hook.find({ publisher: id }, '-__v')
        .lean()
        .cache(60)
      return res.json({
        items: hooks.map(h => {
          return {
            ...h,
            _links: linkController.createLinkForHook(h),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  }

  async createNewHook(req, res, next) {
    try {
      const { id } = req.token
      const publisher = await Publisher.findById(id)
      if (!publisher) {
        next(createError(403, 'Your token is not valid or expired'))
      }
      const { action, callback, secret } = req.body
      let hook = new Hook({ action, callback, publisher: id, secret})
      hook = await hook.save()
      const links = linkController.createLinkForHook(hook)
      hook = hook.toObject()
      return res
        .status(201)
        .header('Location', links.self)
        .json({
          ...hook,
          _links: links,
        })
    } catch (e) {
      next(e)
    }
  }

  async getOneHook(req, res, next) {
    try {
      const publisherId = req.token.id
      const hook = await Hook.findById(req.params.id, '-__v')
        .lean()
        .cache(60)
      if (!hook) {
        return next()
      }
      if (hook.publisher !== publisherId) {
        next(createError(403))
      }
      hook.secret = cryptr.decrypt(hook.secret)
      return res.json({
        ...hook,
        _links: linkController.createLinkForHook(hook),
      })
    } catch (e) {
      next(e)
    }
  }

  async updateOneHook(req, res, next) {
    try {
      const publisherId = req.token.id

      let hook = await Hook.findById(req.params.id, '-__v')
      if (!hook) {
        return next()
      }
      if (hook.publisher !== publisherId) {
        next(createError(403))
      }
      const ignoreKeys = ['_id publisher']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        hook[key] = req.body[key]
      })
      await hook.save()
      hook = hook.toObject()
      return res.json({
        ...hook,
        _links: linkController.createLinkForHook(hook),
      })
    } catch (e) {
      next(e)
    }
  }

  async deleteOneHook(req, res, next) {
    try {
      const publisherId = req.token.id
      const hook = await Hook.findById(req.params.id)
      if (!hook) {
        return next()
      }
      if (hook.publisher !== publisherId) {
        next(createError(403))
      }
      await hook.remove()
      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  }
}
