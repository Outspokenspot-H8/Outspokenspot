const request = require('supertest');
const app = require('../app');

describe('Testing user routes', () => {
  describe('POST /login success', () => {
    it('should return response with status code 200', (done) => {
      // setup
      const body = {
        email: 'admin@mail.com',
        password: '123456'
      }
      // execute
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('access_token');
            expect(res.body).toHaveProperty('email', body.email);
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('role');

            done();
          }
        })

    })
  })

  describe('POST /login failed', () => {
    it('Email not found, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: 'admin123@mail.com',
        password: '123456'
      }
      // execute
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('message', 'Email/password is invalid');

            done();
          }
        })

    })

    it('Wrong password, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: 'admin@mail.com',
        password: '123456789'
      }
      // execute
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('message', 'Email/password is invalid');

            done();
          }
        })

    })

    it('Empty email & password, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: '',
        password: ''
      }
      // execute
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('message', 'Email is required');

            done();
          }
        })

    })
  })

  describe('POST /register success', () => {
    it('should return response with status code 201', (done) => {
      // setup
      const body = {
        username: 'admin2',
        email: 'admin2@mail.com',
        password: '123456',
        location: 'Bekasi',
      }
      // execute
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('username');
            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('location');
            expect(res.body).toHaveProperty('username', body.username);
            expect(res.body).toHaveProperty('email', body.email);
            expect(res.body).toHaveProperty('location', body.location);

            done();
          }
        })

    })
  })

  // Register failed
  describe('POST /register failed', () => {
    it('Empty username, should return response with status code 400', (done) => {
      // setup
      const body = {
        username: '',
        email: 'admin@mail.com',
        password: '123456',
        location: 'Jakarta',
      }
      // execute
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toEqual(true);
            expect(res.body.errors).toEqual(
              expect.arrayContaining(['Username is required'])
            )

            done();
          }
        })

    })

    it('Empty email, should return response with status code 400', (done) => {
      // setup
      const body = {
        username: 'admin2',
        email: '',
        password: '123456',
        location: 'Jakarta',
      }
      // execute
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toEqual(true);
            expect(res.body.errors).toEqual(
              expect.arrayContaining(['Email is required'])
            )

            done();
          }
        })

    })

    it('Empty password, should return response with status code 400', (done) => {
      // setup
      const body = {
        username: 'admin2',
        email: 'admin2@mail.com',
        password: '',
        location: 'Jakarta',
      }
      // execute
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toEqual(true);
            expect(res.body.errors).toEqual(
              expect.arrayContaining(['Email is required'])
            )

            done();
          }
        })

    })

    it('Empty location, should return response with status code 400', (done) => {
      // setup
      const body = {
        username: 'admin2',
        email: 'admin2@mail.com',
        password: '123456',
        location: '',
      }
      // execute
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toEqual(true);
            expect(res.body.errors).toEqual(
              expect.arrayContaining(['Location is required'])
            )

            done();
          }
        })

    })

    it('Not email format, should return response with status code 400', (done) => {
      // setup
      const body = {
        username: 'admin2',
        email: 'admin2',
        password: '123456',
        location: 'Jakarta',
      }
      // execute
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toEqual(true);
            expect(res.body.errors).toEqual(
              expect.arrayContaining(['Email must be in email format'])
            )

            done();
          }
        })

    })

  })

})