// const express = require('express')
// const app = express()

const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

// const cors = require('cors')
// require('dotenv').config()

// app.use(cors())
// app.use(express.json())

// const Blog = require('./models/blog')

// app.get('/api/blogs', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

// app.post('/api/blogs', (request, response, next) => {
//   const body = request.body
//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes
//   })

//   blog.save().then(savedBlog => {
//     response.json(savedBlog)
//   }).catch(error => next(error))
// })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})