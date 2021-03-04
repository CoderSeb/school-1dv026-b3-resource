/**
 * Module for the AuthenticationController.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import { Image } from '../models/image.js'
import jwt from 'jsonwebtoken'
import fs from 'fs-extra'
import axios from 'axios'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * Returns all images.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllImages (req, res, next) {
    const userData = verifyRequest(req.token)
    if (userData !== null) {
      const images = await Image.find({})
      res.json(images)
    } else {
      res.status(403).send('JWT Validation failed')
    }
  }

  /**
   * Adds an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async postImage (req, res, next) {
    try {
      const userData = verifyRequest(req.token)
      if (userData !== null) {
        const { data, contentType, location, description } = await req.body
        const imageData = {
          data: data,
          contentType: contentType,
          location: location || null,
          description: description || null
        }

        axios({
          method: 'post',
          url: `${process.env.EXT_IMAGE_LIB_URL}/images`,
          headers: {
            'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(imageData)
        }).then(response => {
          res.json(response)
        }).catch(err => {
          res.json(err)
          next(err)
        })
      } else {
        res.status(403).send('JWT Validation failed')
      }
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Verify the given token and returns the encoded data.
 *
 * @param {string} token - As the token to be verified.
 * @returns {object} - If the token is valid. Else returns null.
 */
function verifyRequest (token) {
  let result = null
  const publicKey = fs.readFileSync('./public.pem', 'utf8')
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, data) {
    if (err) {
      return result
    }
    result = data
  })
  return result
}
