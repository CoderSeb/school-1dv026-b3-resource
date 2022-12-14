/**
 * Module for the AuthenticationController.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import { Image } from '../models/image.js'
import jwt from 'jsonwebtoken'
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
    try {
      if (userData !== null) {
        const imagePayload = []
        const images = await Image.find({ author: userData.email })
        for (let i = 0; i < images.length; i++) {
          imagePayload.push(images[i].toClient())
        }
        res.json(imagePayload)
      } else {
        res.status(403).send('JWT Validation failed')
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Returns one image with the id given.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getOneImage (req, res, next) {
    const userData = verifyRequest(req.token)
    try {
      if (userData !== null) {
        const image = await Image.find({ id: req.params.id })
        if (image.length < 1) {
          res.status(404).send('Image with id not found')
        } else {
          res.json(image[0].toClient())
        }
      } else {
        res.status(403).send('JWT Validation failed')
      }
    } catch (err) {
      next(err)
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
        const bodyInput = await req.body
        const imageData = JSON.stringify(bodyInput)
        const config = {
          method: 'post',
          url: `${process.env.EXT_IMAGE_LIB_URL}/images`,
          headers: {
            'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          },
          data: imageData
        }
        axios(config).then(async (response) => {
          if (response.data.imageUrl && response.status === 201) {
            const newImage = new Image({
              id: response.data.id,
              imageUrl: response.data.imageUrl,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt,
              description: bodyInput.description || null,
              location: bodyInput.location || null,
              author: userData.email
            })
            await newImage.save()
            res.status(201).json(newImage.toClient())
          }
        }).catch(err => {
          next(err)
        })
      } else {
        res.status(403).send('JWT Validation failed')
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Full update of an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async fullUpdateImage (req, res, next) {
    try {
      const userData = verifyRequest(req.token)
      if (userData !== null) {
        const bodyInput = await req.body
        const imageData = JSON.stringify(bodyInput)
        const config = {
          method: 'put',
          url: `${process.env.EXT_IMAGE_LIB_URL}/images/${req.params.id}`,
          headers: {
            'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN
          }
        }
        axios(config, imageData).then(response => {
          if (response.status === 204) {
            const config = {
              method: 'get',
              url: `${process.env.EXT_IMAGE_LIB_URL}/images/${req.params.id}`,
              headers: {
                'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN
              }
            }
            axios(config).then(resp => {
              console.log('Get reached!')
              Image.updateOne({ id: req.params.id }, {
                imageUrl: resp.data.imageUrl,
                createdAt: resp.data.createdAt,
                updatedAt: resp.data.updatedAt,
                description: bodyInput.description || null,
                location: bodyInput.location || null,
                author: userData.email
              }, (err, updated) => {
                if (err) next(err)
                res.sendStatus(204)
              })
            }).catch(err => {
              next(err)
            })
          }
        }).catch(err => {
          if (err.response.status === 404) {
            res.status(404).send('Image with id not found')
          } else {
            next(err)
          }
        })
      } else {
        res.status(403).send('JWT Validation failed')
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Partially updates an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partialUpdateImage (req, res, next) {
    try {
      const userData = verifyRequest(req.token)
      if (userData !== null) {
        const imageToBeUpdated = await Image.find({ id: req.params.id, author: userData.email })
        if (imageToBeUpdated.length < 1) {
          res.status(404).send('Image with id not found')
        }
        Image.findOneAndUpdate({ id: req.params.id }, {
          description: req.body.description || imageToBeUpdated[0].description,
          location: req.body.location || imageToBeUpdated[0].location
        }, (err, image) => {
          if (err) next(err)
          res.sendStatus(204)
        })
      } else {
        res.status(403).send('JWT Validation failed')
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Delete an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteImage (req, res, next) {
    try {
      const userData = verifyRequest(req.token)
      if (userData !== null) {
        const config = {
          method: 'delete',
          url: `${process.env.EXT_IMAGE_LIB_URL}/images/${req.params.id}`,
          headers: {
            'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN
          }
        }
        axios(config).then(response => {
          if (response.status === 204) {
            Image.deleteOne({ id: req.params.id, author: userData.email }, function (err) {
              if (err) next(err)
              res.sendStatus(204)
            })
          }
        }).catch(err => {
          if (err.response.status === 404) {
            res.status(404).send('Image with id not found')
          } else {
            next(err)
          }
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
  const publicKey = Buffer.from(process.env.PUBLIC_KEY64, 'base64')
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, data) {
    if (err) {
      return result
    }
    result = data
  })
  return result
}
