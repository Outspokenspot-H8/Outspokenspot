const app = require('../app')
const http = require('http')
const port = process.env.PORT || 4000
const socketio = require('socket.io')
const server = http.createServer(app)

const io = socketio(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
});

let rooms = []

io.on('connection', (socket) => {
  socket.on('login', (data) => {
    socket.emit('get-rooms', rooms)
  })

  socket.on('create-room', (payload) => {
      let room = {
        name: payload['room-name'],
        users: [],
        admin: payload.admin
      }
      rooms.push(room)
      io.emit('updated-room', rooms)
  })

  socket.on('fetch-room', () => {
      socket.emit('fetched-room', rooms)
  })
  
  socket.on('join-room', (data) => {
    socket.join(data['room-name'])
    let roomIndex = rooms.findIndex((room) => room.name === data['room-name'] )
    rooms[roomIndex].users.push(data.user)
    io.sockets.to(data['room-name']).emit('room-detail', rooms[roomIndex])
  })

  socket.on('start-game', (data) => {
    socket.broadcast.to(data).emit('started-game', data)
  })

  socket.on('get-room-detail', (data) => {
    let roomIndex = rooms.findIndex((room) => room.name === data )
    io.sockets.to(data).emit('got-room-detail', rooms[roomIndex])
  })
  
  socket.on('fetch-room-detail', (name) => {
    let roomIndex = rooms.findIndex((room) => room.name === name )
    console.log(rooms[roomIndex]);
    io.sockets.to(name).emit('fetched-room-detail', rooms[roomIndex])
  })
})

server.listen(port, () => {
    console.log(`Outspokenspotapp listening on port: ${port}`)
})

// module.exports = server