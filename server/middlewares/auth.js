const { verifyToken } = require('../helpers/jwt-helper')
const { User } = require('../models')

const authenticate = (req, res, next) => {
  try {
    let { id } = verifyToken(req.headers.access_token)
    User.findOne({
      where: { id }
    })
      .then(user => {
        if (!user) {
          next({code: 404, message: 'User not found'});
        } else {
          req.loggedUser = { id: user.id, username: user.username, email: user.email, location: user.location }
          next()
        }
      })
      .catch(err => next(
        next(err)
      ))
  } catch (error) {
    console.log(error);
    next({code: 401, message: 'Authentication error, please login'})
  }
}

module.exports = authenticate