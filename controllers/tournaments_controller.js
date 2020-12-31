const Tournament = require('../models/tournament')

exports.getTournaments = (req, res, next) => {
  Tournament.find()
    .then(tournaments => {
      res.status(200).json({
        tournaments: tournaments
      })
    })
    .catch(err=>console.log(err))
}

exports.getTournament = (req, res, next) => {
  Tournament.findById(req.params.id)
    .then(tournament => {
      if (!tournament){
        res.status(404).json({message: "Tournament not found"})
      }
      res.status(201).json({
        tournament: tournament
      })
    })
    .catch(err=>console.log(err))
}

exports.createTournament = (req, res, next) => {
  const tournament = new Tournament({
    name: req.body.name, 
    // creator: req.body.creator,
    category: req.body.category,
    playerLimit: req.body.playerLimit,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    participants: [],
    active: false
  })
  tournament.save()
    .then(() => {
      res.status(201).json({
        tournament: tournament
      })
    })
    .catch(err=>console.log(err))
}

exports.joinTournament = (req, res, next) => {
  const user = User.findById(req.body.id)
  const tournament = Tournament.findById(req.params.id)

  if (tournament.participants.length < tournament.playerLimit){
    tournament.participants.push(user)
    tournament.save()
      .then(savedTournament => {
        res.status(201).json({
          message: "Player added to tournament",
          tournament: savedTournament
        })
      })
  } else {
    res.status(200).json({
      message: "Could not add player to tournment. Player limit has already been reached."
    })
  }
}