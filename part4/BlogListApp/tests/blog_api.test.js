/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})
    const initialUser = helper.initialUsers[0]
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(initialUser.password, saltRounds)
    const user = new User({
      username: initialUser.username,
      name: initialUser.name,
      passwordHash,
    })

    await user.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('verify existence of id property', async () => {
    const response = await api.get('/api/blogs')

    response.body.map((r) => expect(r.id).toBeDefined())
  })
})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const saltRounds = 10
    let passwordHash = await bcrypt.hash(
      helper.initialUsers[0].password,
      saltRounds
    )
    let user = new User({
      username: helper.initialUsers[0].username,
      name: helper.initialUsers[0].name,
      passwordHash,
    })

    await user.save()

    passwordHash = await bcrypt.hash(
      helper.initialUsers[1].password,
      saltRounds
    )
    user = new User({
      username: helper.initialUsers[1].username,
      name: helper.initialUsers[1].name,
      passwordHash,
    })

    await user.save()

    const users = await helper.usersInDb()

    console.log('Users: ', users)

    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: users[0].id })
    )

    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)

    const blogs = await helper.blogsInDb()

    console.log('Blogs: ', blogs)
  })

  test('a valid blog can be added', async () => {
    const credentials = {
      username: 'puod',
      password: 'abcd123',
    }

    const auth = await api.post('/api/login').send(credentials)

    const newBlog = {
      author: 'Aleks Miller',
      title: 'The Gospel According to AL',
      likes: 69,
      url: 'www.breakingpoint.com',
    }

    await api
      .post('/api/blogs')
      .auth(auth.body.token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((b) => b.title)
    expect(contents).toContain('The Gospel According to AL')
  })

  test('adding blog fails with 401 Unauthorized if a token is not provided', async () => {
    const newBlog = {
      author: 'Aleks Miller',
      title: 'The Gospel According to AL',
      likes: 69,
      url: 'www.breakingpoint.com',
    }

    await api.post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map((b) => b.title)
    expect(contents).not.toContain('The Gospel According to AL')
  })

  test('if likes property is missing from blog, default it to zero', async () => {
    const credentials = {
      username: 'puod',
      password: 'abcd123',
    }

    const auth = await api.post('/api/login').send(credentials)

    const newBlog = {
      author: 'Aleks Miller',
      title: 'The Gospel According to AL',
      url: 'www.breakingpoint.com',
    }

    await api
      .post('/api/blogs')
      .auth(auth.body.token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    blogsAtEnd.map((r) => expect(r.likes).toBeDefined())
  })

  test('if title is missing from request, respond to request with 400', async () => {
    const credentials = {
      username: 'puod',
      password: 'abcd123',
    }

    const auth = await api.post('/api/login').send(credentials)

    const newBlog = {
      author: 'Aleks Miller',
      likes: 69,
      url: 'www.breakingpoint.com',
    }

    await api
      .post('/api/blogs')
      .auth(auth.body.token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('if url is missing from request, respond to request with 400', async () => {
    const credentials = {
      username: 'puod',
      password: 'abcd123',
    }

    const auth = await api.post('/api/login').send(credentials)

    const newBlog = {
      author: 'Aleks Miller',
      title: 'The Gospel According to AL',
      likes: 69,
    }

    await api
      .post('/api/blogs')
      .auth(auth.body.token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const saltRounds = 10
    let passwordHash = await bcrypt.hash(
      helper.initialUsers[0].password,
      saltRounds
    )
    let user = new User({
      username: helper.initialUsers[0].username,
      name: helper.initialUsers[0].name,
      passwordHash,
    })

    await user.save()

    passwordHash = await bcrypt.hash(
      helper.initialUsers[1].password,
      saltRounds
    )
    user = new User({
      username: helper.initialUsers[1].username,
      name: helper.initialUsers[1].name,
      passwordHash,
    })

    await user.save()

    const users = await helper.usersInDb()

    console.log('Users: ', users)

    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: users[0].id })
    )

    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)

    const blogs = await helper.blogsInDb()

    console.log('Blogs: ', blogs)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    // All blogs have userID of puod
    const blogCreatedByUser = helper.initialBlogs[0]

    const credentials = {
      username: 'puod',
      password: 'abcd123',
    }

    const auth = await api.post('/api/login').send(credentials)

    console.log('blogcbU: ', blogCreatedByUser)

    await api
      .delete(`/api/blogs/${blogCreatedByUser._id}`)
      .auth(auth.body.token, { type: 'bearer' })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogCreatedByUser.title)
  })
})

describe('update of a blog', () => {
  test('update likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    let updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

    expect(updatedBlog.likes).not.toEqual(blogToUpdate.likes)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('abc123', 10)
    const user = new User({ username: 'puod', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'puod',
      name: 'Aleks Miller',
      password: 'abc123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
