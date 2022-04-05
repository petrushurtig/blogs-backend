const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Very Good Blog post',
        author: 'Andrei Author',
        url: 'www.blog.com',
        likes: 77
    },
    {
        title: 'Super Blog post',
        author: 'Anna Writerson',
        url: 'www.bestblogs.com',
        likes: 125
    }
]
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObj = new Blog(initialBlogs[0])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[1])
    await blogObj.save()
})
describe('blogs api tests', () => {
test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
    const content = response.body.map(r => r)
    expect(response.body).toHaveLength(initialBlogs.length)
})
test('identifier is called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(element => {
        expect(element.hasOwnProperty('id')).toBe(true)
    })
})
test('a new blog is added to db', async () => {
    const newBlog = {
        title: 'How to add blog posts?',
        author: 'Test Man',
        url: 'stackoverflow.com',
        likes: 0
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(initialBlogs.length +1)
    expect(titles).toContain(
        'How to add blog posts?'
    )
})
test('blog without likes gets likes:0', async () => {
    const newBlog = {
        title: 'How to add blog posts?',
        author: 'Test Man',
        url: 'stackoverflow.com'
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length +1)
    expect(response.body.at(-1).likes).toBe(0)
})

test('post without title and url gives status 400', async() => {
    const newBlog = {
        author: 'Test Man',
        likes: 123
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

})

afterAll(() => {
    mongoose.connection.close()
})
})