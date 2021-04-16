const socketServer = require('./socketConfig')
const httpServer = require('./bin/http')
socketServer.attach(httpServer)

// nodemon server.js