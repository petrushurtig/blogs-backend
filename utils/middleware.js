const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {
    const auth = req.get('authorization')
    if(!auth) return res.status(401).send('unauthorized')
    if(auth && auth.toLowerCase().startsWith('bearer ')){
        const token = auth.substring(7)
        const decoded = jwt.verify(token, process.env.SECRET)
        req.user = await User.findById(decoded.id)
        next()
    }
    else {
        res.status(400).send('Invalid token')
    }
}

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)
    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' })
    }
    next(error)
}
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor
}