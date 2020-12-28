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
  }]
})

module.exports = mongoose.model('Round', roundSchema)