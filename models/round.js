const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roundSchema = new Schema({
  num: {
    type: Number, 
    required: true
  }, 
  matches: [{
    type: Schema.Types.ObjectId, 
    ref: 'Match'
  }], 
  tournament: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament', 
    required: true
  }, 
  completed: [{
    type: Schema.Types.ObjectId, 
    ref: 'Match'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

roundSchema.method.createMatches = async function(){
  //BASED OFF THE ROUND NUM MATCH UP PLAYERS RANDOMLY TO SEPERATE MATCHES AND PUSH THEM INTO THE MATCHES ARRAY//
}

module.exports = mongoose.model('Round', roundSchema)