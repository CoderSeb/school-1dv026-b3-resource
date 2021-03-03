/**
 * Database configuration script file.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import mongoose from 'mongoose'

/**
 * Creates a connection to the database.
 *
 * @returns {Promise} If the connection is successful.
 */
export const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database connection is open...'))
  mongoose.connection.on('error', error => console.log(`Database connection error has occurred: ${error}`))
  mongoose.connection.on('disconnected', () => console.log('Database is disconnected...'))

  // Closing the connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Database connection is about to close due to application termination.')
      process.exit(0)
    })
  })

  // Connect to database.
  return mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
}
