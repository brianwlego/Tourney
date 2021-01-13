const express = require('express')
const {body} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


const router = express.Router()
const usersController = require('../controllers/users_controller')

//RELOAD USER//
router.get('/user', usersController.grabUser)

//LOGIN USER//
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .bail()
    .custom(value => {
      return User.findOne({email: value}).then(foundUser => {
        if (!foundUser){
          return Promise.reject('User not found. Please enter a valid email.')
        }
      })
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Incorrect password')
    .bail()
    .custom(async (value, {req}) => {
      const user = await User.findOne({email: req.body.email})
      if (!user){
        return Promise.reject('Incorrect password')
      }
      const isEqual = await bcrypt.compare(value, user.password)
      if (!isEqual) {
        return Promise.reject('Incorrect password')
      }
    })  
], usersController.loginUser)
//SIGNUP USER//
router.post('/signup', [
  body('username')
    .trim()
    .notEmpty()
    .withMessage("Username can't be empty"),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .bail()
    .custom(value => {
      return User.findOne({email: value}).then(foundUser => {
        if (foundUser){
          return Promise.reject('Email address already used. Please enter a valid email address.')
        }
      })
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty"),
], usersController.createUser)
//LOGOUT USER//
router.get('/logout', usersController.logoutUser)



module.exports = router;