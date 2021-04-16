const request = require('supertest');
const app = require('../app');
const { User } = require('../models')

describe('Testing user routes', () => {
  afterAll((done) => {
    User.destroy({ where: {
      username: 'admin2'
    } })
      .then(() => {
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  describe('GET / success', () => {
    it('Access "/" should return response with status code 200', (done) => {
      request(app)
        .get('/')
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('message');

            done();
          }
        })

    })
  })


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
            expect(res.body).toHaveProperty('message', 'Invalid email or password');

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
            expect(res.body).toHaveProperty('message', 'Invalid email or password');

            done();
          }
        })

    })

    it('Empty email, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: '',
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
            expect(res.body).toHaveProperty('message', 'Email is required');

            done();
          }
        })

    })

    it('Empty password, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: 'admin@mail.com',
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
            expect(res.body).toHaveProperty('message', 'Password is required');

            done();
          }
        })
    })

    it('Not sending email body, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: {email: 'email'},
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
            expect(res.statusCode).toEqual(500);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('message');

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
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('user created');
            expect(res.body).toHaveProperty('user');

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
              expect.arrayContaining(['username is required'])
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
              expect.arrayContaining(['email is required'])
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
              expect.arrayContaining(['password is required'])
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
              expect.arrayContaining(['location is required'])
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
              expect.arrayContaining(['invalid email format'])
            )

            done();
          }
        })

    })

    it('Body is not complete, should return response with status code 400', (done) => {
      // setup
      const body = {
        email: 'admin2@mail.com',
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
            expect(res.statusCode).toEqual(500);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('message');

            done();
          }
        })

    })

  })

})