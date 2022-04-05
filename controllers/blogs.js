const blogsRouter = require('express').Router()
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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
blogsRouter.post('/', async (req, res) => {
    const body = req.body
    const user = await User.findById('624c2e72a5d4b468e3b151b0')
   
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
})

//DELETE
blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})
//PUT
blogsRouter.put('/:id', async (req, res, next) => {
    const body = req.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const blogToUpdate = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    if(blogToUpdate){
        res.status(200).json(blogToUpdate)
    } else {
        res.status(404).end()
    }
})

module.exports = blogsRouter