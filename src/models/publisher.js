// mongoose model for publishers
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import validator from 'validator'
import createError from 'http-errors'
import { nanoid } from 'nanoid'
import { Ad } from './advertisment.js'
import { Area } from './area.js'
import { Hook } from './hook.js'

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: nanoid(7),
    },
    area: {
      type: String,
      required: true,
      ref: 'Area',
    },
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: v => validator.isEmail(v),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { transform: (doc, ret) => ({ ...ret, password: undefined }) },
  }
)

// check if area exists
schema.pre('save', async function(next) {
  this.name = validator.escape(this.name)
  const area = await Area.findById(this.area)
  if (!area) {
    next(createError(403, `Invalid area ${this.area}`))
  }
})

schema.post('save', (doc, next) =>{
  cachegoose.clearCache()
  next()
})

schema.post('findOneAndDelete', async (doc, next) => {
  await Ad.deleteMany({ publisher: doc._id })
  await Hook.deleteMany({ publisher: doc._id })
  cachegoose.clearCache()
  next()
})

// Error for duplicate key
schema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const key = Object.keys(error.keyValue)[0]
    const value = error.keyValue[key]
    next(createError(403, `${key} ${value} is already in use`))
  } else {
    next()
  }
})

export const Publisher = mongoose.model('Publisher', schema)
