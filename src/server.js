/**
 * Main script file of the authentication service.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './routes/router.js'
import { connectDB } from './config/mongo.js'

/**
 * Main function of the authentication service.
 */
const main = async () => {
  await connectDB()

  // Creates an express application.
  const app = express()
  app.use(helmet())
  app.use(logger('dev'))
  app.use(express.json({ limit: '500kb' }))

  // Error handler.
  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
    } else {
      return res.status(500)
    }
  })

  // Register routes.
  app.use('/', router)

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
}

main().catch(console.error)
