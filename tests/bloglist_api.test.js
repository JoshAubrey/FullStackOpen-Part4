const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
      const response = await helper.blogsInDb()
    
      expect(response).toHaveLength(helper.initialBlogs.length)
  })
    
  test('a specific blog is within the returned list', async () => {
      const response = await helper.blogsInDb()
    
      const titles = response.map(r => r.title)
      expect(titles).toContain(
          'React patterns'
      )
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await helper.blogsInDb()
    expect(response[0].id).toBeDefined()
  })

})

describe('viewing a specific blog', () => {

  test('a specific blog can be viewed by id', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
  
    expect(resultBlog.body).toEqual(processedBlogToView)
  })

})

describe('addition of a new blog', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await helper.blogsInDb()
  
    const titles = response.map(r => r.title)
  
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'Canonical string reduction'
    )
  })

  test('if likes are missing from new blog, it will default to 0', async () => {
    const newBlog = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('if title and url are missing from new blog, it will respond with 400 bad req', async () => {
    const newBlog = {
        author: "Robert C. Martin",
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    expect(response.statusCode).toEqual(400)
  })

})

describe ('updating a blog', () => {

  test('a specific blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    let blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes = 9000

    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)

    expect(resultBlog.body.likes).toEqual(9000)
  })

})

describe('deletion of a blog', () => {

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.title)
  })

})

// describe('when there is initially one user at db', () => {

// })

afterAll(() => {
  mongoose.connection.close()
})