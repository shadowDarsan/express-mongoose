import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()
connectDB()

const app = express()
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.use('/public', express.static('public'))
}

const __dirname = path.resolve()

if (process.env.NODE_ENV === 'development') {
  app.use('/public', express.static('public'))
  app.use(express.static(path.join(__dirname, '/frontend/build')))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('Api running...')
  })
}

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5345
app.listen(port, () => {
  console.log(`Server started on port:port ${port}`.yellow.italic)
})
