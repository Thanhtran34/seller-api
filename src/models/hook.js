// Mongoose model for webhook
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import validator from 'validator'
import shortid from 'shortid'
import Cryptr from 'cryptr'
import { actions } from '../config/hookAction.js'

const cryptr = new Cryptr('myTotalySecretKey')
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
        message: `action/event must be one of [${actionValues.join()}]`,
      },
    },
    secret: {
      type: String,
      required: true
    },
    callback: {
      type: String,
      required: true,
      validate: {
        validator: v => validator.isURL(v),
        message: 'callback URL needs to be valid',
      },
    }
  },
  { timestamps: true }
)

schema.pre('save', async function (next) {
  this.secret = cryptr.encrypt(this.secret)
  next()
})

schema.post('save', (doc, next) => {
  cachegoose.clearCache()
  next()
})

schema.post('remove', (doc, next) => {
  cachegoose.clearCache()
  next()
})

export const Hook = mongoose.model('Webhook', schema)

