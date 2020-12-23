const express =  require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

const userRoutes = require('./routes/user_routes')

app.use(bodyParser.urlencoded({extended: false}));


app.use(userRoutes)


mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(3000)
  })