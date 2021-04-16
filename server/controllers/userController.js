const { generateToken } = require('../helpers/jwt-helper')
const { comparePassword } = require('../helpers/password-helper')
const { User } = require('../models')

class UserController {
  static register (req, res, next) {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      location: req.body.location
    })
      .then(user => {
        res.status(201).json({
          success: true,
          message: "user created",
          user: {
            id: user.id,
            email: user.email
          }
        })
      })
      .catch(err => next(err))
  }

  static login (req, res, next) {
    const { email, password } = req.body
    User.findOne({ where: { email }})
      .then(user => {
        //If user is found
        if (user) {
          //compare Sync password
          const comparedPassword = comparePassword(password, user.password)
          //if password true
          if(comparedPassword) {
            //generate JWT { id: user.id, email: user.email } as Payload
            const access_token = generateToken({ id: user.id, email: user.email })
            res.status(200).json({ access_token })
          } else {
             //if user input wrong password or email
            next({
              message: 'Invalid email or password'
            })
          }
        } else {
          //if user input wrong password or email (email not found)
          next({
            message: 'Invalid email or password'
          })
        }
      })
      .catch(err => {
        next({
          name: 'Invalid email or password'
        })
      })
  }
}

module.exports = UserController