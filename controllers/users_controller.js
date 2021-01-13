const User = require('../models/user')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.grabUser = async (req, res, next) => {
  try{
    const token = req.cookies.token
    if (!token){
      res.status(203).json({
        message: "No user logged in. Please log in."
      })
    } else {
      const decodedToken = jwt.verify(token, 'brianandryansecret')
      if(!decodedToken) {
        res.status(203).json({
          message: "Token not valid. Please log in."
        })
      }
      req.userId = decodedToken.userId
      const user = await User.findById(req.userId).populate('createdTournaments', '_id').populate('joinedTournaments', '_id')
      res.status(201).json({
        message: 'User authenticated and found',
        user: {
          _id: user._id.toString(), 
          username: user.username, 
          email: user.email, 
          joinedTournaments: user.joinedTournaments, 
          createdTournaments: user.createdTournaments
        }
      })
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

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
    const token = jwt.sign({
      email: user.email, 
      userId: user._id.toString()
    }, 'brianandryansecret', {expiresIn: '2h'});
    res
      .status(201)
      .cookie('token', token, {httpOnly: true})
      .json({
        message: 'New User created',
        user: {
          _id: user._id.toString(), 
          username: user.username, 
          email: user.email, 
          joinedTournaments: user.joinedTournaments, 
          createdTournaments: user.createdTournaments}
      })
  } catch(error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.loginUser = async (req, res, next) => {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
      const err =  new Error('Validation failed')
      err.statusCode = 422
      err.data = errors.array();
      throw err;
    }
    const user = await User.findOne({email: req.body.email}).populate('createdTournaments').populate('joinedTournaments')
    const token = jwt.sign({
      email: user.email, 
      userId: user._id.toString()
    }, 'brianandryansecret', {expiresIn: '2h'});
    
    res
      .status(200)
      .cookie('token', token, {httpOnly: true})
      .json({
        message: "User logged in!",
        user: {
          _id: user._id.toString(), 
          username: user.username, 
          email: user.email, 
          joinedTournaments: user.joinedTournaments, 
          createdTournaments: user.createdTournaments}
      })
  } catch(error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.logoutUser = (req, res, next) => {
  res.status(200)
    .clearCookie('token')
    .json({
      message: "User logged out."
    })

}