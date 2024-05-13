const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });
        if (users) {
            response.json(users)
        } else {
            response.status(404).end()
        }
    } catch (e) {
        next(e)
    }
})

usersRouter.post("/", async (request, response, next) => {
    try {
        const { username, name, password } = request.body

        if (!password) {
            response.status(400).json("Password is missing.").end()
        }

        if (password && password.length < 3) {
            response
                .status(400)
                .json("Password must have more than 3 characters.")
                .end()
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        try {
            const user = new User({
                username,
                name,
                passwordHash,
            })

            const savedUser = await user.save()
            response.status(201).json(savedUser)
        } catch (e) {
            response.status(400).json("Username must be unique.").end()
            next(e)
        }
    } catch (e) {
        response.status(400).json(e.body)
        next(e)
    }
});

module.exports = usersRouter