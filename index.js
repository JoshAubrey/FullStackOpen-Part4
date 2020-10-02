// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }
const app = require('./app')
const http = require('http')
//const express = require('express')
//const app = express()
//const cors = require('cors')
//const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')


// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = process.env.MONGODB_URI
// console.log('connecting to', mongoUrl)
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//     .then(result => {
//         console.log('connected to MongoDB')
//     })
//     .catch((error) => {
//         console.log('error connecting to MongoDB:', error.message)
//     })

// app.use(cors())
// app.use(express.json())

// app.get('/api/blogs', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog(request.body)

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
// })

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})