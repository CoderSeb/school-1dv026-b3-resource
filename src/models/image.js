/**
 * Mongoose model User.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import val from 'validator'

// Create a schema.
const schema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    validate: val.isURL,
    unique: true
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  id: {
    type: String
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
}, {
  timestamps: true
})

schema.method('toClient', function () {
  const obj = this.toObject()
  delete obj._id
  delete obj.__v
  return obj
})

// Create a model using the schema.
export const Image = mongoose.model('Image', schema)
