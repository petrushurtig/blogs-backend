const blogsRouter = require('express').Router()
const app = require('../app')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const blog = require('../models/blog')

const getUser = middleware.userExtractor
//GET
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, _id: 1})
    res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})
//POST
blogsRouter.post('/',getUser, async (req, res) => {
    const body = req.body
    const user = await User.findById(req.user)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
})

//DELETE
blogsRouter.delete('/:id',getUser , async (req, res, next) => {
    const user = req.user
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(404).end()
    }
    if(blog && blog.user.toString() ===  user._id.toString()){
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
    }
    else {
        res.status(401).json({ error: 'Unauthorized'})
    }
    next()
})
//PUT
blogsRouter.put('/:id',getUser, async (req, res, next) => {
    const body = req.body
    const user = req.user
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    }
    const blogToUpdate = await Blog.findById(req.params.id)
    if(!blogToUpdate){
        res.status(404).end()
    }
    if(blogToUpdate && blogToUpdate.user.toString() === user._id.toString()){
       const updated=  await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
        if(updated){
            res.status(200).json(updated)
        }
    } else {
        res.status(401).json({ error: 'Unauthorized'})
    }
    next()
})

module.exports = blogsRouter