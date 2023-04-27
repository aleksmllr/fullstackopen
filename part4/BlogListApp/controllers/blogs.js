/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.extractUser, async (request, response) => {
  console.log('---Entry to POST endpoint COMPLETE---')

  const { body } = request
  const { user } = request

  if (!body.title || !body.url) {
    response.status(400).json('Title or URL is missing from request!')
    return
  }
  console.log('---CHECKPOINT 1---')

  console.log('body: ', body)
  console.log('user: ', user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  })

  console.log('---CHECKPOINT 2---')

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  console.log('---CHECKPOINT 3---')

  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.extractUser,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const { user } = request
    const userId = user._id

    if (blog.user && userId && blog.user.toString() === userId.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      return response.status(204).end()
    }
    return response.status(401).json({ error: 'Invalid user' })
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(204).end()
})

module.exports = blogsRouter
