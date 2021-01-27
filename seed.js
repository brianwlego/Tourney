require('dotenv').config();
const bcrypt = require('bcryptjs')
const seeder = require('mongoose-seed')

seeder.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, function(){
  seeder.loadModels([
    './models/match.js',
    './models/round.js',
    './models/tournament.js',
    './models/user.js',
  ]);
  seeder.clearModels(['Match','Round','Tournament','User'], () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    })
  })
});

function createUsers(){
  let resultObj = {'model': 'User', 'documents': []}
  let i = 1;
  while (i < 11){
    let newUserB = {
      'username': `Brian${i}`,
      'email': `brian${i}@brian.com`,
      'password': bcrypt.hashSync('123123', 12),
      'joinedTournaments': [],
      'createdTournaments': []
    }
    let newUserR = {
      'username': `Ryan${i}`,
      'email': `ryan${i}@ryan.com`,
      'password': bcrypt.hashSync('1234', 12),
      'joinedTournaments': [],
      'createdTournaments': []
    }
    resultObj['documents'].push(newUserB)
    resultObj['documents'].push(newUserR)
    i++
  }
  return resultObj;
}
function createTourneys(){
  
}


function createData(){
  const users = createUsers();
  const tourneys = createTourneys();

  return [users, tourneys];
}

const data = createData(); //[{'model': 'User', 'documents': []}]