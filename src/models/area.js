// Mongoose model for area
import mongoose from'mongoose'

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    population: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
)

export const Area = mongoose.model('Area', schema)
