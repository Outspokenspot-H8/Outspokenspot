const server = require('./bin/https')
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
})

let rooms = ['Halo']

io.on('connection', socket => {
  socket.on('login', (data) => {
    socket.emit('get-rooms', rooms)
  })
})

module.exports = io