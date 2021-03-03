/**
 * Module for the AuthenticationController.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import mongoose from 'mongoose'
import { User } from '../models/image.js'
import jwt from 'jsonwebtoken'
import fs from 'fs-extra'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * Registers a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllImages (req, res, next) {
    console.log('001')
    const publicKey = fs.readFileSync('./public.pem', 'utf8')
    jwt.verify(req.token, publicKey, { algorithms: ['RS256'] }, function (err, data) {
      if (err) {
        console.log(err)
        res.sendStatus(403)
      } else {
        res.json({
          message: 'Welcome!',
          payload: data
        })
      }
    })
  }
}
