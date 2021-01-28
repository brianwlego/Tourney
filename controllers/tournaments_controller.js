const Tournament = require('../models/tournament')
const User = require('../models/user')



exports.getUpcomingTournaments = async (req, res, next) => {
  try{
    const tournaments = await Tournament.find({
      startDate: {$gt: Date.now()}
    })
    res.status(200).json({
      upcomingTournaments: tournaments
    })
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.getCurrentTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find({active: true})
    res.status(200).json({
      currentTournaments: tournaments
    })
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.getPastTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find({endDate: {$lt: Date.now()}})
    res.status(200).json({
      pastTournaments: tournaments
    })
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.getTournament = async (req, res, next) => {
  try {
    const tournament  = await (await Tournament.findById(req.params.id).populate('rounds')).populate('matches')
    if (!tournament){
      res.status(404).json({message: "Tournament not found"})
    } else {
      res.status(201).json({
        tournament: tournament
      })
    }
  } catch (err){
    err=>console.log(err)
  }
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
    message: "Upcoming",
    tournament: tournament
  })
  const user = User.findById(req.userId)
  user.createdTournaments.push(tournament._id)
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
      tournament.participants.push(user._id)
      user.joinedTournaments.push(tournament._id)
      await user.save();
      const newTourney = await tournament.save()

      //FOR IF SAVED TOURNAMENT HAS NOW REACHED CAPACITY//
      if(tournament.participants.length === tournament.playerLimit){
        
        const data = await newTourney.activate();
        res.status(201).json({
          message: "Current",
          tournament: data
        })
      } else {
        //FOR IF TOURNAMENT PLAYER LIMIT STILL HASN'T BEEN REACHED//
        res.status(200).json({
          message: "Player added to tournament",
          tournament: newTourney
        })
      }

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