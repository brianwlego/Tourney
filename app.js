const express =  require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user_routes');
const tournamentRoutes = require('./routes/tournament_routes');
const matchRoutes = require('./routes/match_routes')

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, PATCH, DELETE',
  allowedHeaders: 'Content-Type, Accepts, Authorization',
  optionsSuccessStatus: 200
}))
app.use(bodyParser.json());



app.use('/tournament/:id',matchRoutes)
app.use(tournamentRoutes)
app.use(userRoutes)


mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(8000)
  })