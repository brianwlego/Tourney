const express = require('express')
const tournaments_controller = require('../controllers/tournaments_controller')
const isAuth = require('../middleware/is-auth')


const router = express.Router()

//INDEX//
router.get('/upcoming-tournaments', isAuth, tournaments_controller.getUpcomingTournaments)
router.get('/current-tournaments', isAuth, tournaments_controller.getCurrentTournaments)
router.get('/past-tournaments', isAuth, tournaments_controller.getPastTournaments)
//SHOW//
router.get('/tournament/:id', tournaments_controller.getTournament)
//CREATE//
router.post('/tournament', isAuth, tournaments_controller.createTournament)
//JOIN TOURNAMENT//
router.put('/tournament/:id/join', isAuth, tournaments_controller.joinTournament)


module.exports = router; 