/**
 * The routes.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import express from 'express'
import { ResourceController } from '../controllers/resource-controller.js'

export const router = express.Router()
const controller = new ResourceController()

router.get('/images', verifyToken, controller.getAllImages)

/**
 * Verifies that a token exists, else it returns a 403.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express middleware function.
 */
function verifyToken (req, res, next) {
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader !== 'undefined') {
    const tokenArray = bearerHeader.split(' ')
    const token = tokenArray[1]
    const tokenParts = token.split('.')
    const signature = tokenParts[2]
    req.signature = signature
    req.token = token
    next()
  } else {
    res.sendStatus(403)
  }
}

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(res.sendStatus(404)))
