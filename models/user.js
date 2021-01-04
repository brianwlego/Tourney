const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
  username: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  repeatPassword: {
    type: String, 
    required: true
  },
  joinedTournaments: [{
    type: Schema.Types.ObjectId, 
    ref: 'Tournament'
  }], 
  createdTournaments: [{
    type: Schema.Types.ObjectId, 
    ref: 'Tournament'
  }]

})

module.exports = mongoose.model('User', userSchema)