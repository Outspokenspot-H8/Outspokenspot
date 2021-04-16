const router = require('express').Router()
const UserController = require('../controllers/UserController')
const GameController = require('../controllers/gameController');
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/game', GameController.randomQuestion)


module.exports= router;