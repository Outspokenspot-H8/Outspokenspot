const router = require('express').Router()
const UserController = require('../controllers/UserController')
const GameController = require('../controllers/gameController')
const authenticate = require('../middlewares/auth')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(authenticate)
router.get('/game', GameController.randomQuestion)


module.exports= router;