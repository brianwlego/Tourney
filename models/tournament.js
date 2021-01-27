const mongoose = require('mongoose');
const Round = require('./round');
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

tourneySchema.methods.activate = async function(){
  const firstRound = new Round({
    num: 1,
    tournament: this._id,
    completed: [],
    matches: [],
    //FIX THIS ERROR
    players: [...this.participants]
  })
  await firstRound.createMatches();
  this.active = true;
  this.rounds.push(firstRound)
  await this.save()
  return this
}


module.exports = mongoose.model('Tournament', tourneySchema)