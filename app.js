var http = require('http');
var util = require('util');
var fs 	 = require('fs');
var mysql = require('mysql');

var self = this;

var DEBUG					= true;
var SERVER_LISTEN_PORT		= 3000;
var SERVER_LISTEN_PORT_TWO 	= 3001;

var connection = '';

// Connect to MySQL Database 
// --------------
function connectToDB(callback){
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'shoohangman'
	});

	connection.connect(function(err) {
	  if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	  }
	  console.log('connected as id ' + connection.threadId);
	  callback();
	});
}

function closeConnDB(){
	connection.end();
}


self.active_users = {};
self.active_games = {};

self.game_queue = [];

self.active_users["billy"] = { "socketId": null, "gamesWon": 0, "gamesLost": 0, "currentGameId": "fdf4325" };
self.active_games["fdf4325"] = {};

self.addPlayerToQueue = function(data){
	console.log("Adding player to queue !");
	console.log(data);

	console.log("Game Queue:");
	console.log(self.game_queue);
	console.log(self.active_users['hahaaa']);
	// self.game_queue.push('hello');
	// self.game_queue.push('car');

	// check if the player is already in the game queue
	if (self.game_queue.indexOf(data.userid) === -1){
		self.game_queue.push(data.userid);
	}

	// match players
	if (self.game_queue.length > 1){
		// remove the first 2 players from the queue

		// send each a message
	}
}

// this.dude = 5;

// console.log("=-========== " + this.dude);
// console.log("=-========== " + self.dude);

function handleSocketRequests(io){
	io.on('connection', function (socket) {
		console.log("your socket id is: " + socket.id);

		socket.on('addPlayerToQueue', self.addPlayerToQueue );


		// console.log(socket);

		// socket.emit('news', { hello: 'world' });
		// socket.on('blah', function (data) {
		// 	console.log("NEW DATA:");
	 //    	console.log(data);
	 //  });
	});
}

function init(){

	console.log(self.active_users['billy']);

	var express = require('express');
	var app = express();

	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	app.use(express.static(process.cwd() + '/public'));
	server.listen(3000);

	handleSocketRequests(io);
}

init();

exports.egg = {"hello": 5};

// var abc = require("./two.js");