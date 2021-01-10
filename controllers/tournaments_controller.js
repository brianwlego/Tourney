const Tournament = require('../models/tournament')
const User = require('../models/user')



exports.getActiveTournaments = async (req, res, next) => {
  try{
    const tournaments = await Tournament.find({active: true})
    res.status(200).json({
      activeTournaments: tournaments
    })
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.getInactiveTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find({active: false})
    res.status(200).json({
      inactiveTournaments: tournaments
    })
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
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

exports.createTournament = async (req, res, next) => {
  try {
  const tournament = new Tournament({
    name: req.body.name, 
    description: req.body.description,
    creator: req.userId,
    category: req.body.category,
    playerLimit: req.body.playerLimit,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    participants: [],
    active: false
  })
  await tournament.save()
  res.status(201).json({
    tournament: tournament
  })
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.joinTournament = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    const tournament = await Tournament.findById(req.params.id)
    if (tournament.participants.length < tournament.playerLimit){
      //FOR IF THERE IS STILL SPACE IN TOURNAMENT//
      tournament.participants.push(user)
      user.joinedTournaments.push(tournament)
      await user.save();
      await tournament.save()
      res.status(201).json({
        message: "Player added to tournament",
        tournament: tournament
      })
    } else {
      //IF CAPACITY FOR THE TOURNAMENT HAS BEEN REACHED//
      res.status(400).json({
        message: "Could not add player to tournment. Player limit has already been reached."
      })
    }
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}