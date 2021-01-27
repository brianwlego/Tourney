const mongoose = require('mongoose')
require('datejs')
require('dotenv').config();
const bcrypt = require('bcryptjs')
const Faker = require('faker')

const User = require('./models/user')
const Tournament = require('./models/tournament')
const Match = require('./models/match')
const Round = require('./models/round')


async function  createUsers(){
  console.log('Deleting Users collection')
  await User.deleteMany()
  console.log('Finished deleting Users')

  const saveArray = []

  const brian = new User({ username: 'Brian', email: 'brian@brian.com', password: bcrypt.hashSync('123123', 12)})
  const ryan = new User({ username: 'Ryan', email: 'ryanflynn@gmail.com', password: bcrypt.hashSync('1234', 12)})
  saveArray.push(brian, ryan)

  let i = 1;
  while (i <= 10){
    let newUserB = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234'})
    let newUserR = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234'})
    let newUserJ = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234'})
    let newUserI = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234'})

    saveArray.push(newUserB, newUserR, newUserJ, newUserI)
    i++
  }
  console.log('Saving new Users')
  await User.insertMany(saveArray)
  console.log(saveArray.length, 'users created.')

  return saveArray;
}

async function createUpcomingTournaments(allUsers){
  console.log('')
  console.log('Deleting Tournament collection')
  await Tournament.deleteMany()
  console.log('Finished Deleting Tournaments')

  const participantNumArray = [3,4,7,8,15,16,31,32];
  const brian = allUsers[0];

  const saveArray = [];
  const activeAndUpcoming = [];

  for (const num of participantNumArray){
    let parts1 = allUsers.slice(0, num)
    let newT = new Tournament({
      name: `Upcoming ${Faker.random.word()}`,
      description: Faker.lorem.sentences(),
      creator: brian._id.toString(),
      category: Faker.random.word(),
      playerLimit: num,
      startDate: new Date().next().week(),
      endDate: new Date().next().week().addDays(3),
      participants: parts1,
      rounds: [],
      active: (num % 2) ? false : true
    })
    if (newT.active) activeAndUpcoming.push(newT)
    saveArray.push(newT)
  }
  console.log('Saving Upcoming Tournaments')
  await Tournament.insertMany(saveArray)
  console.log(saveArray.length, 'tournaments saved.')

  for (let t of activeAndUpcoming){

  }

}




function seed(){
  mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
    .then(async() => {
      const allUsers = await createUsers()
      await createUpcomingTournaments(allUsers)
    })
    .then(()=>mongoose.disconnect())
    .catch(err => console.log(err))

}

seed()
