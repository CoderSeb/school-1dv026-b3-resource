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
  }
}, {
  timestamps: true
})

// Create a model using the schema.
export const Image = mongoose.model('Image', schema)
