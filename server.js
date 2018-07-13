var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');


app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit:'50mb'}));


var mongoose 	= require('mongoose');

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/instagram');




var Book = require('./models/book');

var User = require('./models/user');

var Post = require('./models/post');

var Honor = require('./models/honor');



var router = require('./router/main.js')(app, Book, User, Post, Honor)


var server = app.listen(3000, function(){
	console.log("Express server has started on port " + 3000)
});