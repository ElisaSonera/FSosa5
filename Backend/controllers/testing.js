const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

router.post('/testblogs', userExtractor, async (request, response) => {
  const firstBlog = new Blog()
  const secondBlog = new Blog()
  const thirdBlog = new Blog()
  const user = request.user

  firstBlog.title = 'eka'
  firstBlog.author = 'jaa'
  firstBlog.likes = 7
  firstBlog.user = user

  secondBlog.title = 'toka'
  secondBlog.author = 'joo'
  secondBlog.likes = 2
  secondBlog.user = user

  thirdBlog.title = 'kolmas'
  thirdBlog.author = 'jee'
  thirdBlog.likes = 13
  thirdBlog.user = user

  await firstBlog.save()
  await secondBlog.save()
  await thirdBlog.save()

  user.blogs = user.blogs.concat(firstBlog._id, secondBlog._id, thirdBlog._id)
  await user.save()

  const testBlogs = [firstBlog, secondBlog, thirdBlog]
  response.status(201).json(testBlogs)
})

module.exports = router
