const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})
describe('when there is initially some blogs saved', () => {
test('all blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
test('identifier is called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(element => {
        expect(element.hasOwnProperty('id')).toBe(true)
    })
})
})
describe('viewing a spesific note', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlog = JSON.parse(JSON.stringify(blogToView))
        expect(resultBlog.body).toEqual(processedBlog)
    })
    test('fails with status code 404 if id is not found', async() => {
        const notFoundId = await helper.nonExistingId()
        await api
        .get(`/api/blogs/${notFoundId}`)
        .expect(404)
    })
})
describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)
    
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
            'How to add blog posts?'
        )
    })
    test('gives default value of 0 to "likes"', async () => {
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
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)
        expect(blogsAtEnd.at(-1).likes).toBe(0)
    })
    test('fails with status code 400 without needed data', async() => {
        const newBlog = {
            author: 'Test Man',
            likes: 123
        }
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })
})
describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length -1
        )
        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
    test('fails with status code 400 if id is invalid', async () => {
        await api
            .delete(`/api/blogs/1`)
            .expect(400)
    })
    test('fails with status code 204 if blog is not found', async () => {
        const id = await helper.nonExistingId()
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)
    })
})
describe('updating a blog', () => {
    test('gives status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const id = blogsAtStart[0].id
        const updated = {
            title: 'Updated title',
            author: 'Updated author',
            url: 'updatedurl.com',
            likes: 12
        }
        await api
            .put(`/api/blogs/${id}`)
            .send(updated)
            .expect(200)
        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('Updated title')
        
    })
    test('gives status code 404 if id is not found', async () => {
        const id = await helper.nonExistingId()
        const updated = {
            title: 'Updated title',
            author: 'Updated author',
            url: 'updatedurl.com',
            likes: 12
        }
        await api
        .put(`/api/blogs/${id}`, updated)
        .expect(404)
    })
    test('gives status code 400 if id is invalid', async () => {
        const updated = {
            title: 'Updated title',
            author: 'Updated author',
            url: 'updatedurl.com',
            likes: 12
        }
        await api
            .put('/api/blogs/1', updated)
            .expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})