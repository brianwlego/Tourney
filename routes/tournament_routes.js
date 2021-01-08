const express = require('express')
const tournaments_controller = require('../controllers/tournaments_controller')
const isAuth = require('../middleware/is-auth')

const router = express.Router()


//INDEX//
router.get('/tournaments', isAuth, tournaments_controller.getTournaments)
//SHOW//
router.get('/tournament/:id', isAuth, tournaments_controller.getTournament)
//CREATE//
router.post('/tournament', isAuth, tournaments_controller.createTournament)


module.exports = router;