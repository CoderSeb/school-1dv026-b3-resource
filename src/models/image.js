/**
 * Mongoose model User.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Create a model using the schema.
export const User = mongoose.model('User', schema)
