const express = require('express')
const {body} = require('express-validator')

const User = require('../models/user')

const router = express.Router()
const usersController = require('../controllers/users_controller')

//INDEX//
router.get('/users', usersController.getUsers)
//SHOW//
router.get('/user/:id', usersController.getUser)
//CREATE//
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
  body('name').trim().notEmpty()
], usersController.createUser)


module.exports = router;