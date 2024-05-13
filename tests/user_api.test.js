const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const bcrypt = require("bcrypt")

const User = require("../models/user")
const users_helper = require("../utils/users_helper")

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash })
  await user.save();
});

test("a new user is successfully created", async () => {
  const initialUsers = await users_helper.getUsers()

  const newUser = {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "salainen",
  }

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const users = await users_helper.getUsers()
  assert.strictEqual(users.length, initialUsers.length + 1)

  const usernames = users.map((user) => user.username)
  assert(usernames.includes(newUser.username))
});

test("if password is missing, returns 400", async () => {
  const newUser = {
    username: "user",
    name: "User Test",
  }

  const result = await api.post("/api/users").send(newUser)
  assert.strictEqual(result.status, 400)
  assert.strictEqual(result.body, "Password is missing.")
});

test("if password has less than 3 characters, returns 400", async () => {
  const newUser = {
    username: "user",
    name: "User Test",
    password: "te",
  }

  const result = await api.post("/api/users").send(newUser)

  assert.strictEqual(result.status, 400)
  assert.strictEqual(result.body, "Password must have more than 3 characters.")
});

test("if username has less than 3 characters, returns 400", async () => {
  const newUser = {
    username: "us",
    name: "User Test",
    password: "test",
  }
  const result = await api.post("/api/users").send(newUser)

  assert.strictEqual(result.status, 400)
});

test("if username is not unique, returns 400", async () => {
  const firstUser = {
    username: "user",
    name: "User Test",
    password: "test",
  }

  await api.post("/api/users").send(firstUser)

  const secondUser = {
    username: "user",
    name: "User Test 2",
    password: "testtest",
  }
  const result = await api.post("/api/users").send(secondUser)

  assert.strictEqual(result.status, 400)
  assert.strictEqual(result.body, "Username must be unique.")
});

after(async () => {
  await mongoose.connection.close()
});