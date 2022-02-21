// Mongoose model for publishers
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import validator from 'validator'
import createError from 'http-errors'
import bcrypt from 'bcrypt'
import { Ad } from './advertisment.js'
import { Area } from './area.js'
import { Hook } from './hook.js'
import shortid from 'shortid'

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    area: {
      type: String,
      required: true,
      ref: "Area",
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
        validator: (v) => validator.isEmail(v),
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
      },
      virtuals: true,
    }
  })

// check if area exists
schema.pre('save', async function (next) {
  this.name = validator.escape(this.name);
  this.password = await bcrypt.hash(this.password, 12)
  const area = await Area.findById(this.area);
  if (!area) {
    next(createError(403, `Invalid area ${this.area}`));
  }
})

schema.post('save', (doc, next) => {
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
  if (error.name === "MongoError" && error.code === 11000) {
    const key = Object.keys(error.keyValue)[0]
    const value = error.keyValue[key]
    next(createError(403, `${key} ${value} is already in use`));
  } else {
    next()
  }
})

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email })

  // Throw error if no user found or passord is wrong
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid username or password.')
  }
  return user
}

schema.statics.getById = async function (id) {
  return this.findOne({ _id: id })
}

schema.statics.insert = async function (userData) {
  const user = new Publisher(userData)
  return user.save()
}

export const Publisher = mongoose.model('Publisher', schema)
