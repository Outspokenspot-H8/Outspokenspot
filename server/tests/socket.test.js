const io = require('socket.io-client')
const server = require('../bin/https')

describe('Suite of sockets tests', () => {
  server.attach(3010)
  let socket;

  beforeEach(function (done) {
    socket = io.connect('http://localhost:3010', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    });

    socket.on('connect', () => {
      console.log('worked...');
      done();
    });
  })

  afterEach((done) => {
    if (socket.connected) {
      console.log('disconnecting...');
      socket.disconnect();
    } else {
      console.log('no connection to break...');
    }

    done();
  })

  afterAll((done) => {
    server.detach()
  })

  describe('login sockets test', () => {
    it('login', (done) => {
      socket.emit('login')

      socket.on('get-rooms', res => {
        expect(Array.isArray(res)).toEqual(true)
        done()
      })
    })
  })

  describe('room based sockets test', () => {
    it('create-room', (done) => {
      let payload = {
        'room-name': 'Test Room',
        max: Number(4),
        admin: 'outspoken',
      }

      socket.emit('create-room', payload)

      socket.on('updated-room', res => {
        expect(Array.isArray(res)).toEqual(true)
        expect(res).toEqual(
          [
            {
              name: 'Test Room',
              max: 4,
              users: [],
              admin: 'outspoken',
              isStarted: false,
            }
          ]
        )
        
        done()
      })
    })

    it('create-room failed because same room name', (done) => {
      let payload = {
        'room-name': 'Test Room',
        max: Number(4),
        admin: 'outspoken',
      }

      socket.emit('create-room', payload)

      socket.on('updated-room', res => {
        expect(res).toEqual(undefined)
        
        done()
      })
    })

    it('fetch-room', (done) => {
      socket.emit('fetch-room')

      socket.on('fetched-room', res => {
        expect(Array.isArray(res)).toEqual(true)
        expect(res).toEqual(
          [
            {
              name: 'Test Room',
              max: 4,
              users: [],
              admin: 'outspoken',
              isStarted: false,
            }
          ]
        )
        
        done()
      })
    })

    it('join-room', (done) => {
      let data = {
        'room-name': 'Test Room',
        user: {
          id: 1,
          username: 'outspoken',
          location: 'Jakarta',
          socketId: socket.id
        }
      }

      socket.emit('join-room', data)

      socket.on('room-detail', res => {
        expect(typeof res).toEqual('object');
        expect(res).toHaveProperty('name');
        expect(res).toHaveProperty('users');
        expect(res).toHaveProperty('max');
        expect(res).toHaveProperty('admin');
        expect(res).toHaveProperty('isStarted');
        
        done()
      })
    })

    it('start-game', (done) => {
      let data = 'Test Room'

      socket.emit('start-game', data)
      // Karena broadcast jadi dia ga denger emitnya
      done()
    })

    it('get-room-detail', (done) => {
      let data = 'Test Room'

      socket.emit('get-room-detail', data)
      
      done()
    })

    it('fetch-room-detail', (done) => {
      let data = 'Test Room'

      socket.emit('fetch-room-detail', data)
      
      done()
    })

  })

  describe('webRTC sockets test', () => {
    it('join-play', (done) => {
      let payload = {
        name: 'Test Room',
        username: 'outspoken'
      }

      socket.emit('join-play', payload)

      socket.on('other-users', res => {
        expect(Array.isArray(res)).toEqual(true)
        
        done()
      })
    })

    it('sending-signal', (done) => {
      let payload = {
        userToSignal: 'lcxkvjldsfj231',
        callerID: socket.id,
        signal: 'oawkdaodk',
        name: 'Test Room'
      }

      socket.emit('sending-signal', payload)

      done()
    })

    it('returning-signal', (done) => {
      let payload = {
        signal: 'oawkdaodk',
        callerID: socket.id,
      }

      socket.emit('returning-signal', payload)

      done()
    })

  })

  describe('Gameplay sockets test', () => {
    it('shuffle-card', (done) => {
      let payload = {
        name: 'Test Room',
        question: 'Kapan terakhir kali anda mengucapkan terima kasih kepada orang tua?',
        questions: [
          'Kapan terakhir kali anda mengucapkan terima kasih kepada orang tua?',
          'Ceritakan pengalaman paling buruk yang pernah anda alami?',
          'Apa hal yang paling kamu syukuri hingga hari ini?'
        ]
      }

      socket.emit('shuffle-card', payload)

      done()
    })

    it('shuffle-user-turn', (done) => {
      let payload = {
        name: 'Test Room',
        player: 'outspokenspot',
        players: ['outspokenspot', 'admin', 'admin2']
      }

      socket.emit('shuffle-user-turn', payload)

      done()
    })

    it('start-gameplay', (done) => {
      let payload = {
        name: 'Test Room',
        questions: [
          'Kapan terakhir kali anda mengucapkan terima kasih kepada orang tua?',
          'Ceritakan pengalaman paling buruk yang pernah anda alami?',
          'Apa hal yang paling kamu syukuri hingga hari ini?'
        ]
      }

      socket.emit('start-gameplay', payload)

      socket.on('get-random-questions', res => {
        console.log(res);
      })
      done()
      
    })

  })


})