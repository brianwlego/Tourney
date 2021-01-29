const mongoose = require('mongoose')
require('datejs')
require('dotenv').config();
const bcrypt = require('bcryptjs')
const Faker = require('faker')

const User = require('./models/user')
const Tournament = require('./models/tournament')
const Match = require('./models/match')
const Round = require('./models/round')
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

async function  createUsers(){
  console.log('Deleting Users collection')
  await User.deleteMany()
  console.log('Finished deleting Users')

  const saveArray = []

  const brian = new User({ username: 'Brian', email: 'brian@brian.com', password: bcrypt.hashSync('123123', 12), joinedTournaments: []})
  const ryan = new User({ username: 'Ryan', email: 'ryanflynn@gmail.com', password: bcrypt.hashSync('1234', 12), joinedTournaments: []})

  let i = 1;
  while (i <= 10){
    let newUserB = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234', joinedTournaments: []})
    let newUserR = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234', joinedTournaments: []})
    let newUserJ = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234', joinedTournaments: []})
    let newUserI = new User({ username: Faker.name.firstName(), email: Faker.internet.email(), password:'1234', joinedTournaments: []})

    saveArray.push(newUserB, newUserR, newUserJ, newUserI)
    i++
  }
  saveArray.push(brian, ryan)
  console.log('Saving new Users')
  await User.insertMany(saveArray)
  console.log(saveArray.length, 'users created.')

  return saveArray;
}

async function deleteTRMCollections(){
  console.log('')
  console.log('Deleting Tournament collection')
  await Tournament.deleteMany()
  console.log('')
  console.log('Deleting Round collection')
  await Round.deleteMany()
  console.log('')
  console.log('Deleting Match collection')
  await Match.deleteMany()
}


//USED FOR CREATING UPCOMING TOURNAMENTS//
//BOTH INACTIVE(not reached player limit) & ACTIVE(reached player limit)//
async function createUpcomingTournaments(allUsers){
  await deleteTRMCollections()
  
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

    for (let user of parts1){
      user.joinedTournaments.push(newT)
      await user.save();
    }
    console.log('')
    console.log('Saved User joined Tournaments')

  }
  console.log('Saving Upcoming Tournaments')
  await Tournament.insertMany(saveArray)
  console.log(saveArray.length, 'tournaments saved.')

  //CREATING ROUNDS/MATCHES FOR ACTIVE TOURNEYS//
  await createFirstRound(activeAndUpcoming)
  
}
async function createFirstRound(array){
  for (let t of array){
    const firstRound = new Round({
      num: 1, 
      tournament: t._id,
      players: t.participants,
      winners: [],
      matches: []
    })

    let numOfMatches = (firstRound.players.length/2)
    let playerArray = shuffle(firstRound.players)

    while(numOfMatches !== 0){
      const p1 = playerArray.pop()
      const p2 = playerArray.pop()
      const newMatch = new Match({
        timeLimit: new Date().addDays(1),
        round: firstRound._id,
        players: [p1, p2]
      })
      firstRound.matches.push(newMatch)
      numOfMatches--;
    }
    console.log('')
    console.log(`Saving ${firstRound.matches.length} matches`)
    console.log('Saving First Round for', t.name)
    await Match.insertMany(firstRound.matches)
    await firstRound.save();
    
    t.rounds.push(firstRound)
    await t.save()
  }
}

//USED FOR CREATING PAST TOURNAMENTS//
async function createPastTournaments(allUsers){
  const participantNumArray = [4,8,16,32];
  const brian = allUsers[0];
  
  const saveArray = [];
  
  for (const num of participantNumArray){
    let parts1 = allUsers.slice(0, num)
    let newT = new Tournament({
      name: `Past ${Faker.random.word()} Tournament`,
      description: Faker.lorem.sentences(),
      creator: brian._id.toString(),
      category: Faker.random.word(),
      playerLimit: num,
      startDate: new Date().last().week(),
      endDate: new Date().last().week().addDays(3),
      participants: parts1,
      rounds: [],
      active: false
    })
    saveArray.push(newT)

    //ADDING THIS TOURNAMENT TO USERS JOINEDT'S//
    for (let user of parts1){
      user.joinedTournaments.push(newT)
      await user.save();
    }
    console.log('')
    console.log('Saved User joined Tournaments')


  }
  console.log('')
  console.log(`Saving ${saveArray.length} Past Tournaments`)
  await Tournament.insertMany(saveArray)

  await createPastRsMs(saveArray);
}
async function createPastRsMs(arrayOfTs){

  for (t of arrayOfTs){

    let numOfRounds = Math.log2(t.participants.length)
    let players = [...shuffle(t.participants)]

    while(numOfRounds !== 0){
      const r = new Round({
        num: numOfRounds, 
        tournament: t._id,
        players: players,
        winners: [],
        matches: []
      })
       //CREATE MATCHES//
      let numOfMatches = (r.players.length/2)
      while(numOfMatches !== 0){
        const p0 = players.pop()
        const p1 = players.pop()
        const result = Math.floor(Math.random() * Math.floor(2));
        const newMatch = new Match({
          timeLimit: new Date().last().month(),
          round: r._id,
          players: [p0, p1],
          winner: result ? p0 : p1,
          loser: result ? p1 : p0
        })
        r.matches.push(newMatch)
        r.winners.push(newMatch.winner)
        numOfMatches--;
      }
      console.log('')
      console.log('Saving Round & Match')
      await Match.insertMany(r.matches)
      await r.save()
      t.rounds.push(r)

      numOfRounds = (numOfRounds - 1)
      players = r.winners
    }
    await t.save()
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
      await createPastTournaments(allUsers)
    })
    .then(()=>{
      console.log('')
      console.log('SEEDING COMPLETE')
      console.log('')
      mongoose.disconnect()
    })
    .catch(err => console.log(err))

}

seed()
