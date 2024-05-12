const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({});
    for (const blog of blogs) {
        const blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test.only('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test.only("the blog list returns the correct amount of blog posts", async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 6)
});

test.only("the unique identifier property of the blog posts is named id, not _id as in the database", async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.strictEqual(typeof response.body[0].id, 'string');
    assert.strictEqual(typeof response.body[0]._id, 'undefined');
});

test.only("a new blogpost is successfully created", async () => {
    const newBlog = {
        author: "Anne White",
        title: "Blogpost Test Created",
        url: "https://www.test.com",
        likes: 6,
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")
    const blogTitle = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, blogs.length + 1)
    assert.ok(blogTitle.includes("Blogpost Test Created"))
});
