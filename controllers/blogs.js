const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response, next) => {
  try { 
    const body = request.body

    const token = request.token //getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    // if (!token || !decodedToken.id) {
    //   return response.status(401).json({ error: 'token missing or invalid' })
    // }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }

})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  try { 
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === user.id.toString() ){
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    else {
      return response.status(401).json({ error: 'Current user does not match blog creator' })
    }

  } catch(exception) {
    next(exception)
  }
})

module.exports = blogRouter
