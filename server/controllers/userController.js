const { generateToken } = require('../helpers/jwt-helper')
const { comparePassword } = require('../helpers/password-helper')
const { User } = require('../models')

class UserController {
  static register (req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      location: req.body.location
    }
    User.create(newUser)
      .then(user => {
        res.status(201).json({
          message: "user created",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            location: user.location
          }
        })
      })
      .catch(err => {
        next(err)
      })
  }

  static login (req, res, next) {
    const { email, password } = req.body

    if (!email) {
      next({code: 400, message: 'Email is required'})
  } else if (!password) {
      next({code: 400, message: 'Password is required'})
  } else {
    User.findOne({ where: { email }})
      .then(user => {
        if (user) {
          const comparedPassword = comparePassword(password, user.password)
  
          if(comparedPassword) {
            const access_token = generateToken({ id: user.id, email: user.email })
            res.status(200).json({ access_token })
          } else {
            next({
              code: 400,
              message: 'Invalid email or password'
            })
          }
        } else {
          next({
            code: 400,
            message: 'Invalid email or password'
          })
        }
      })
      .catch(err => {
        next(err)
      })
    }

  }
}

module.exports = UserController