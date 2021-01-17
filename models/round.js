const mongoose = require('mongoose');
const Match = require('./match');
const Schema = mongoose.Schema

const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

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

roundSchema.methods.createMatches = async function(){
  //BASED OFF THE ROUND NUM MATCH UP PLAYERS RANDOMLY//
  //TO SEPERATE MATCHES AND PUSH THEM INTO THE MATCHES ARRAY//
  let numOfMatches = (this.players.length / 2)
  let playerArray = shuffle(this.players)
  while(numOfMatches !== 0){
    const player1 = playerArray.pop();
    const player2 = playerArray.pop();

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newMatch = new Match({
      timeLimit: tomorrow,
      round: this._id,
      players: [player1, player2]
    })
    await newMatch.save()
    this.matches.push(newMatch)
    numOfMatches -= 1;
  }
  this.save()
}

module.exports = mongoose.model('Round', roundSchema)