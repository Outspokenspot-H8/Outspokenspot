const socketServer = require('./socketConfig')
const server = require('./bin/https')
socketServer.attach(server)

// nodemon server.js