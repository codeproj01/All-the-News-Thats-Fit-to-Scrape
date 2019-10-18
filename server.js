// dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const axios = require("axios");

// set up express app
const PORT = process.env.PORT || 8080;
const app = express();

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride('_method'))
app.use(logger('dev'))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(require('./controllers'));

// configure mongoose to log into db
mongoose.Promise = Promise;

//const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/mongoNewsArticles";
const dbURI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
// Database configuration with mongoose
mongoose.set('useCreateIndex', true)
mongoose.connect(dbURI, { useNewUrlParser: true });

const db = mongoose.connection;

// Console log mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// connection to db through mongoose, console log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// start the server, listen on port 3000
app.listen(PORT, function() {
        console.log("App running on port " + PORT);
    });

module.exports = app;