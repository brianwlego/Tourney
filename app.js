const express =  require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user_routes');
const tournamentRoutes = require('./routes/tournament_routes');

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
  next();
})


app.use(userRoutes)
app.use(tournamentRoutes)


mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(3000)
  })