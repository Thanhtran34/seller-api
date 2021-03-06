// Mongoose model advertisement
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import validator from 'validator'
import shortid from 'shortid'

const sanitize = value => validator.escape(value).trim()

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
    area: {
      type: String,
      required: true,
      ref: 'Area',
    },
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 35,
      set: sanitize,
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      set: sanitize,
    },
    body: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 3000,
      set: sanitize,
    },
    validFrom: {
      type: Date,
      default: Date.now(),
    },
    validTo: {
      type: Date,
      required: true,
      min: Date.now(),
    },
    imageUrl: {
      type: String,
      validate: {
        validator: v =>
          validator.isURL(v) && v.match(/\.(jpeg|jpg|gif|png|svg)$/),
        message:
          'imageUrl must be valid to an image with format in jpg, gif, png, svg',
      }
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

export const Ad = mongoose.model('Advertisement', schema)