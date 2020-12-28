const Match = require('../models/match')
const Round = require('../models/round')

//CREATE//
exports.createMatch = (req, res, next) => {

  //Deleineate between specific round Number and round document in database
  const foundRound = Round.findById(req.body.round)

  const createdMatch = Match.create({
    round: foundRound.num,
    players: req.body.players, //this needs to be an array from the frontend,
    timeLimit: req.body.timeLimit,
    winner: {},
    loser: {}
  })

  foundRound.matches.push(createdMatch)
  foundRound.save()
    .then(()=> {
      res.status(201).json({
        match: createdMatch
      })
    })

}