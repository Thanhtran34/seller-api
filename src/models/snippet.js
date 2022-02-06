/**
 * Mongoose model snippet.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import mongoose from 'mongoose'

/**
 * Create a schema for snippet.
 *
 */
const snippetSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
    required: false,
    default: null
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 20
  },
  code: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  tags: [String]
}, {
  timestamps: true
})
/**
 * Create a model using the schema.
 *
 */
export const Snippet = mongoose.model('Snippet', snippetSchema)
