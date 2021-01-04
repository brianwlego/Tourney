const express = require('express')
const { model } = require('mongoose')


const router = express.Router()

const usersController = require('../controllers/users_controller')

//INDEX//
router.get('/users', usersController.getUsers)
//SHOW//
router.get('/user/:id', usersController.getUser)
//CREATE//
router.post('/signup', usersController.createUser)


module.exports = router;