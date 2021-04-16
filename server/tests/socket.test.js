const io = require('socket.io-client')
const server = require('../socketConfig')

describe('Suite of unit tests', () => {
  //ngejalain servernya
  server.attach(3010)
  // let sender;
  // let receiver;
  let socket;

  beforeEach(function (done) {
    // Setup
    socket = io.connect('http://localhost:3010', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    });

    socket.on('connect', () => {
      console.log('worked...');
      done();
    });
    socket.on('disconnect', () => {
      console.log('disconnected...');
    })
  })

  afterEach((done) => {
    // Cleanup
    if (socket.connected) {
      console.log('disconnecting...');
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }

    done();
  })

  afterAll((done) => {
    server.detach()
  })

  // Describe
  describe('login test', () => {

    // it('Blbalba', (done) => {

    // })

  })

})