// Mongoose model for webhook
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import validator from 'validator'
import shortid from 'shortid'
import { actions } from '../config/hookAction.js'

const actionValues = Object.keys(actions).map(key => actions[key])

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    publisher: {
      type: String,
      required: true,
      ref: 'Publisher',
    },
    action: {
      type: String,
      required: true,
      validate: {
        validator: v => actionValues.includes(v),
        message: `action needs to be one of [${actionValues.join()}]`,
      },
    },
    callback: {
      type: String,
      required: true,
      validate: {
        validator: v => validator.isURL(v),
        message: 'callback needs to be a valid URL',
      },
    }
  },
  { timestamps: true }
)

schema.post('save', (doc, next) => {
  cachegoose.clearCache()
  next()
})

schema.post('remove', (doc, next) => {
  cachegoose.clearCache()
  next()
})

export const Hook = mongoose.model('Webhook', schema)

