const express =  require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user_routes');
const tournamentRoutes = require('./routes/tournament_routes');

app.use(bodyParser.urlencoded({extended: false}));


app.use(userRoutes)
app.use(tournamentRoutes)


mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(3000)
  })