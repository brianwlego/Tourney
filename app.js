const express =  require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user_routes');
const tournamentRoutes = require('./routes/tournament_routes');
const matchRoutes = require('./routes/match_routes');

const app = express();


app.use(cookieParser())
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, PATCH, DELETE',
  allowedHeaders: 'Content-Type, Accepts, Authorization',
  optionsSuccessStatus: 200
}))




app.use('/tournament/:id',matchRoutes)
app.use(tournamentRoutes)
app.use(userRoutes)

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500;
  const message = error.message || 'Server error!'
  res.status(status).json({message: message, data: error.data})
})


mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(8000)
  })