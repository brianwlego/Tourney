require('dotenv').config();
const bcrypt = require('bcryptjs')
const seeder = require('mongoose-seed')

function createData(){
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
    let newUserJ = {
      'username': `James${i}`,
      'email': `james${i}@james.com`,
      'password': bcrypt.hashSync('1234', 12),
      'joinedTournaments': [],
      'createdTournaments': []
    }
    let newUserI = {
      'username': `Ian${i}`,
      'email': `ian${i}@ian.com`,
      'password': bcrypt.hashSync('1234', 12),
      'joinedTournaments': [],
      'createdTournaments': []
    }
    resultObj['documents'].push(newUserB)
    resultObj['documents'].push(newUserR)
    resultObj['documents'].push(newUserJ)
    resultObj['documents'].push(newUserI)
    i++
  }
  return [resultObj];
}
const data = createData();

function seed(){
  seeder.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, function(){
    seeder.loadModels([
      './models/user.js'
    ]);
    seeder.clearModels(['User'], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      })
    })
  });
}



seed();