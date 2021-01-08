const mongoose = require('mongoose')
const Schema = mongoose.Schema


const tourneySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    required: true
  },
  playerLimit: {
    type: Number, 
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  rounds: [{
    type: Schema.Types.ObjectId,
    ref: 'Round'
  }],
  active: {
    type: Boolean,
    required: true
  }

})

tourneySchema.method.createRound = function(){
  //Called once participantes.length reaches the player limit
  //

  
}


module.exports = mongoose.model('Tournament', tourneySchema)