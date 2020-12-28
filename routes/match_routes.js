const express = require('express')

const router = express.Router()

const matches_controller = require('../controllers/matches_controller')

//CREATE//
router.post('/match', matches_controller.createMatch)

module.exports = router;