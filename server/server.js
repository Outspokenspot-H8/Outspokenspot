const socketServer = require('./socketConfig')
const httpServer = require('./bin/https')
socketServer.attach(httpServer)

// nodemon server.js