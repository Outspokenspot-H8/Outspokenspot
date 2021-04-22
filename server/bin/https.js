const app = require('../app')
const http = require('http')
const port = process.env.PORT || 4000
const socketio = require('socket.io')
const server = http.createServer(app)
const _ = require('lodash')

const io = socketio(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
});

let rooms = []

io.on('connection', (socket) => {
  socket.on('login', (data) => {
    const filtered = rooms.filter(room => room.isStarted === false)
    socket.emit('get-rooms', filtered)
  })

  socket.on('create-room', (payload) => {
    let room = {
      name: payload['room-name'],
      users: [],
      max: payload.max,
      admin: payload.admin,
      isStarted: false,
      chats: [],
      queQuantity: payload.queQuantity,
    }
    const filtered = rooms.filter(roomExist => roomExist.name === room.name)
    if(filtered.length !== 0){
      socket.emit('updated-room')
    } else {
      rooms.push(room)
      socket.emit('updated-room', rooms)
    }
  })

  socket.on('fetch-room', () => {
    const filtered = _.remove(rooms, function(room) {
      return (room.isStarted === true && room.users.length === 0)
    })
    const filter = rooms.filter(room => {
      return room.isStarted === false
    })
    socket.emit('fetched-room', filter)
  })
  
  socket.on('join-room', (data) => {
    socket.join(data['room-name'])
    let roomIndex = rooms.findIndex((room) => room.name === data['room-name'] )
    const exist = rooms[roomIndex].users.find(user => user.username === data.user.username);

    if(!exist){
      rooms[roomIndex].users.push(data.user);
    }

    io.sockets.to(data['room-name']).emit('room-detail', rooms[roomIndex])
  })

  socket.on('start-game', (data) => {
    let roomIndex = rooms.findIndex((room) => room.name === data)
    rooms[roomIndex].isStarted = true
    socket.broadcast.to(data).emit('started-game', data)
  })

  socket.on('get-room-detail', (data) => {
    let roomIndex = rooms.findIndex((room) => room.name === data )
    io.sockets.to(data).emit('got-room-detail', rooms[roomIndex])
  })
  
  socket.on('fetch-room-detail', (name) => {
    let roomIndex = rooms.findIndex((room) => room.name === name )
    io.sockets.in(name).emit('fetched-room-detail', rooms[roomIndex])
  })

  socket.on('join-play', ({name, username}) => {
    let roomIndex = rooms.findIndex((room) => room.name === name )
    let otherUsers;
    let otherUsersSocketID;
    if (rooms[roomIndex]) {
      otherUsers = rooms[roomIndex].users.filter(user => user.username !== username )
      otherUsersSocketID = otherUsers.map(user => user.socketId)
    }

    
    socket.emit('other-users', otherUsers)
  })

  socket.on('send-message', ({name, player, message}) => {
    let roomIndex = rooms.findIndex((room) => room.name === name )
    let messagePlayer = {
      player,
      message
    }
    rooms[roomIndex].chats.push(messagePlayer)
    io.sockets.in(name).emit('fetch-all-message', rooms[roomIndex].chats)
  })

  socket.on('sending-signal', (payload) => {
    io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID, otherUser: payload.otherUser });
  })

  socket.on('returning-signal', (payload) => {
    io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id });
  })

  socket.on('shuffle-card', (payload) => {
    io.sockets.in(payload.name).emit('get-random-question', {question: payload.question, questions: payload.questions, index: payload.index})
  })

  socket.on('shuffle-user-turn', (payload) => {
    io.sockets.in(payload.name).emit('get-random-player', {player: payload.player, players: payload.players, index: payload.index})
  })

  socket.on('start-gameplay', (payload) => {
    io.sockets.in(payload.name).emit('get-random-questions', payload.questions)
  })

  socket.on('swap', (payload) => {
    io.sockets.in(payload.name).emit('swap-questions', payload.questions)
  })
  
  socket.on('disconnect', () => {
    let leavedRoom;
    rooms.forEach(room => {
      room.users.forEach(user => {
        if (user.socketId === socket.id) {
          leavedRoom = room
        }
      })
    })

    let otherUsers;
    let otherUsersSocketID;
    let leavedUser;
    let findIndex;

    if (leavedRoom) {
      otherUsers = leavedRoom.users.filter(user => user.socketId !== socket.id)
      otherUsersSocketID = otherUsers.map(user => user.socketId)
      leavedUser = leavedRoom.users.filter(user => user.socketId === socket.id)
      findIndex = leavedRoom.users.indexOf(leavedUser[0])
      leavedRoom.users.splice(findIndex, 1)
    }

    socket.broadcast.emit('user-left', {id: socket.id, leavedRoom});
  })
})

if (process.env.NODE_ENV !== "test") {
  server.listen(port, () => {
      console.log(`Outspokenspotapp listening on port: ${port}`)
  })
}

module.exports = io