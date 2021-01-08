const express = require('express')
const tournaments_controller = require('../controllers/tournaments_controller')
const isAuth = require('../middleware/is-auth')

const router = express.Router()


//INDEX//
router.get('/active-tournaments', tournaments_controller.getActiveTournaments)
router.get('/inactive-tournaments', tournaments_controller.getInactiveTournaments)
//SHOW//
router.get('/tournament/:id', tournaments_controller.getTournament)
//CREATE//
router.post('/tournament', tournaments_controller.createTournament)
//JOIN TOURNAMENT//
router.put('/tournament/:id/join', tournaments_controller.joinTournament)


module.exports = router; 