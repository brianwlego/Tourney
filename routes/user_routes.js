const express = require('express')
const {body} = require('express-validator')
const User = require('../models/user')

const router = express.Router()
const usersController = require('../controllers/users_controller')

//RELOAD USER//
router.get('/user', usersController.grabUser)

//LOGIN USER//
router.post('/login', usersController.loginUser)
//SIGNUP USER//
router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(value => {
      return User.findOne({email: value}).then(foundUser => {
        if (foundUser){
          return Promise.reject('Email address already used. Please enter a valid email address.')
        }
      })
    })
    .normalizeEmail(),
  body('password').trim().notEmpty(),
  body('username').trim().notEmpty()
], usersController.createUser)
//LOGOUT USER//
router.get('/logout', usersController.logoutUser)



module.exports = router;