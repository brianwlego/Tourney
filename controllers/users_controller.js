const User = require('../models/user')

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json({
        users: users
      })
    })
    .catch(err=>console.log(err))
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user){
        res.status(404).json({message: "User not found"})
      }
      res.status(201).json({
        user: user
      })
    })
    .catch(err=>console.log(err))
}

exports.createUser = (req, res, next) => {
  User.create({
    username: req.body.username, 
    email: req.body.email,
    password: req.body.password,
    repeatPassword: req.body.repeatPassword
  })
    .then(user => {
      res.status(201).json({
        user: user
      })
    })
    .catch(err=>console.log(err))
}