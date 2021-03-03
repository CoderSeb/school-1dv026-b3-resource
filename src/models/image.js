/**
 * Mongoose model User.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import val from 'validator'
import bcrypt from 'bcrypt'

// Create a schema.
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: val.isEmail
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  }
}, {
  timestamps: true
})

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    this.password = await bcrypt.hash(this.password, 10)
    return next()
  } catch (err) {
    return next(err)
  }
})

/**
 * Validates a given password with the user password.
 *
 * @param {string} password - The password to be compared.
 * @returns {Promise} - If the validation is successful.
 */
schema.methods.valPass = async function (password) {
  return bcrypt.compare(password, this.password)
}

// Create a model using the schema.
export const User = mongoose.model('User', schema)
