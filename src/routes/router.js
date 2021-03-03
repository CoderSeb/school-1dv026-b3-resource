/**
 * The routes.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import express from 'express'
import { ImagesController } from '../controllers/images-controller.js'

export const router = express.Router()
const controller = new ImagesController()

router.get('/images', controller.getAllImages)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(res.sendStatus(404)))
