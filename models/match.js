const mongoose = require('mongoose')
const Schema = mongoose.Schema

const matchSchema = new Schema({
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  loser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  timeLimit: Date,
  round: {
    type: Schema.Types.ObjectId,
    ref: 'Round'
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

module.exports = mongoose.model('Match', matchSchema)