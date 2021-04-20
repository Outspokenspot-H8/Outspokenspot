const router = require('express').Router()
const UserController = require('../controllers/userController')
const GameController = require('../controllers/gameController')
const authenticate = require('../middlewares/auth')

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Outspokenspot API' })
})
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(authenticate)
router.get('/questions', GameController.randomQuestion)


module.exports= router;