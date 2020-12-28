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
        res.status(404).json({message: "tournament not found"})
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
    category: req.body.category,
    playerLimit: req.body.playerLimit ? req.body.playerLimit : 1,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  })
  const participants = req.body.participants
  
  console.log(tournament)
  //find participants and assign to new tournament
  tourney.save()
    .then(tournament => {
      res.status(201).json({
        tournament: tournament
      })
    })
    .catch(err=>console.log(err))
}