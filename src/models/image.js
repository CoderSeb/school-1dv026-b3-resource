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
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
})

schema.method('toClient', function () {
  const obj = this.toObject()
  delete obj._id
  delete obj.__v
  if (obj.description === null) delete obj.description
  if (obj.location === null) delete obj.location
  return obj
})

// Create a model using the schema.
export const Image = mongoose.model('Image', schema)
