const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

//GET
userRouter.get('/', async (req, res) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1, _id: 1})
    res.json(users)
})

//POST
userRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    const existingUser = await User.findOne({ username })
    if(existingUser) {
        return res.status(400).json({
            error: 'Username already taken'
        })
    }
    if(!password) {
        return res.status(400).json({
            error: 'Password is required'
        })
    }
    if(password.length < 3){
        return res.status(400).json({
            error: 'Password must be at least 3 characters'
        })
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
})
module.exports = userRouter