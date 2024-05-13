const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post("/", async (request, response) => {
    const { title, author, url, likes = 0 } = request.body
    if (!request.token || !request.user)
        return response.status(401).json({ error: "token invalid" })

    const user = request.user

    if (!title || !url) {
        response.status(400).json("Title or url missing.")
    } else {
        const blog = new Blog({
            title: title,
            author: author,
            url: url,
            likes: likes,
            user: user.id,
        })
        const result = await blog.save();
        if (result) {
            user.blogs = user.blogs.concat(result.id)
            await user.save()
            response.status(201).json(result)
        } else {
            response.status(404).end()
        }
    }
});


blogsRouter.delete("/:id", async (request, response) => {
    if (!request.token || !request.user)
        return response.status(401).json({ error: "token invalid" })

    const user = request.user;
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id).then(() => {
            response.status(204).json("Blog deleted successfully.").end()
        })
    } else {
        response.status(400).json({ error: "This blog does not belog to this user." }).end()
    }
});

blogsRouter.put("/:id", async (request, response) => {
    await Blog.findByIdAndUpdate(
        request.params.id,
        { likes: request.body.likes },
        { new: true }
    ).then(() => response.status(204).end())
})

module.exports = blogsRouter