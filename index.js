const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

//Routes
// app.get('/api/blogs', (request, response) => {
//   Blog.find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog(request.body)
//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
// })

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})