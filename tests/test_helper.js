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

const nonExistingId = async () => {
    const blog = new Blog({ 
        title: 'willberemoved',
        author: 'nobodyknows',
        url: 'recyclebin.com',
        likes: 1 
    })
    await blog.save()
    await blog.delete()
    
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}