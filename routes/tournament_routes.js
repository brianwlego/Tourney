const express = require('express')

const router = express.Router()

const tournaments_controller = require('../controllers/tournaments_controller')

//INDEX//
router.get('/tournaments', tournaments_controller.getTournaments)
//SHOW//
router.get('/tournament/:id', tournaments_controller.getTournament)
//CREATE//
router.post('/tournament', tournaments_controller.createTournament)


module.exports = router;