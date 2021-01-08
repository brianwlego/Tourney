const User = require('../models/user')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.createUser = async (req, res, next) => {
  try{
  //ERROR HANDLING
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    const err =  new Error('Validation failed')
    err.statusCode = 422
    err.data = errors.array();
    throw err;
  }
  //CREATING NEW USER 
    const hashedPW = await bcrypt.hash(req.body.password, 12)
    const user = new User({
      username: req.body.username, 
      email: req.body.email,
      password: hashedPW
    })
    await user.save();
    res.status(201).json({
      message: 'New User created',
      userId: user._id
    })
  } catch(error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.loginUser = async (req, res, next) => {
  try{
    const user = await User.findOne({email: req.body.email})
    if (!user){
      const error = new Error('User with submitted email could not be found')
      error.statusCode = 404
      throw error;
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password)
    if (!isEqual){
      const error = new Error('Incorrect password')
      error.statusCode = 401;
      throw error;
    } 
    const token = jwt.sign({
      email: user.email, 
      userId: user._id.toString()
    }, 'brianandryansecret', {expiresIn: '2h'});
    res.status(200).json({
      token: token,
      userId: user._id.toString()
    })
  } catch(error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}