const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
let access_token;

describe('Testing questions routes', () => {
  beforeAll(() => {
    access_token = jwt.sign({id: 1, username: 'admin', email: 'admin@mail.com', location: 'Jakarta' }, process.env.JWT_SECRET);
  })

  describe('GET /questions success', () => {
    it('Should return response with status code 200', (done) => {
      request(app)
      .get('/questions')
      .set('access_token', access_token)
      .end((err, res) => {
        if(err) {
          done(err)
        } else {
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(Array.isArray(res.body)).toEqual(true);

          done()
        }
      })
    })
  })

  describe('GET /questions failed', () => {
    it('Authentication error not sending access_token, should return response with status code 403', (done) => {
      request(app)
      .get('/questions')
      .end((err, res) => {
        if(err) {
          done(err)
        } else {
          expect(res.statusCode).toEqual(403);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual('Authentication error, please login first');

          done()
        }
      })
    })
  })
  
})