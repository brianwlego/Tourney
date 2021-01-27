const mongoose = require('mongoose')
require('dotenv').config();
require('datejs')

mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then( async () => {
    const user = await User.findOne({username: 'Brian1'})
    const usersAll = await User.find({}, '_id')
    const four = createTournamentUpcoming(user, usersAll, 4)
    const eight = createTournamentUpcoming(user, usersAll, 8)
    const sixteen = createTournamentUpcoming(user, usersAll, 16)
    const thirtytwo = createTournamentUpcoming(user, usersAll, 32)
    let result = [four, eight, sixteen, thirtytwo].flat()
    return result
  })
  .then((resultData) => {
    mongoose.disconnect();
    const data = [{'model': 'Tournament', 'documents': resultData}]
    seeder.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, function(){
    seeder.loadModels([
      './models/tournament.js'
    ]);
    seeder.clearModels(['Tournament'], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      })
    })
  });
  })

function createTournamentUpcoming(user, usersAll, participantNum){
  const parts1 = usersAll.slice(0, participantNum)
  const parts2 = usersAll.slice(0, participantNum - 1)
  let tourney1 = {
    'name': `UpcomingTest ${participantNum}`,
    'description': 'Test Description here!!!',
    'creator': user._id.toString(),
    'category': 'Something Fun',
    'playerLimit': participantNum,
    'startDate': new Date().next().week(),
    'endDate': new Date().next().week().addDays(3),
    'participants': parts1,
    'rounds': [],
    'active': true
  }
  console.log(tourney1['participants'])
  let tourney2 = {
    'name': `UpcomingTest ${participantNum - 1}`,
    'description': 'Test Description here!!!',
    'creator': user,
    'category': 'Something Fun',
    'playerLimit': participantNum,
    'startDate': new Date().next().week(),
    'endDate': new Date().next().week().addDays(3),
    'participants': parts2,
    'rounds': [],
    'active': false
  }

  return [tourney1, tourney2]
}