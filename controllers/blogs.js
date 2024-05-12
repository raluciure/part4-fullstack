const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    if (!body.title || !body.url) {
        response.status(400).json({ error: 'Title or URL missing from request' });
        return;
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
    })

    blog.save().then(savedBlog => {
        response.status(201).json(savedBlog)
    }).catch(error => next(error))
})

module.exports = blogsRouter