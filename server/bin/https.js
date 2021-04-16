const app = require('../app')
const http = require('http')
const server = http.createServer(app)
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Outspokenspotapp listening on port: ${port}`)
})

module.exports = server