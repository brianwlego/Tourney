const express =  require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));





mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/tourney?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000)
  })