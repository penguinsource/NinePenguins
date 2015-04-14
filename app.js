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

// create object for user with id 'userid' if one doesn't exist already
self.addUserToActiveUsers = function(username, userid, socketid){
	if ( (self.active_users[userid] === undefined) || 
		 (self.active_users[userid] === null) ){
		
		self.active_users[userid] = { "username": username,
									  "socketId": socketid, 
									  "gamesWon": 0,
									  "gamesLost": 0,
									  "currentGameId": null };
	} else {
		// if user with 'userid' is already defined, then update their socketid
		// console.log("Updating socket id. Old socketid: " + self.active_users[userid].socketId + " to " + socketid );
		self.active_users[userid].socketId = socketid;
	}
}

self.createGameObject = function(p1id, p2id, game_id){
	console.log("Creating Game Object ..");
}

self.getUserWithId = function(userid){
	if (self.active_users[userid]){
		return self.active_users[userid];
	} else {
		console.log("ERROR ! User with id: ");
		console.log(userid);
		console.log("doesn't exit !");
		return null;
	}
}

self.addPlayerToQueue = function(data, socket, io){
	console.log("Adding player to queue !");
	// console.log(data);
	console.log("socket id: ");
	console.log(socket.id);
	// self.game_queue.push('hello');

	self.addUserToActiveUsers(data.username, data.userid, socket.id);

	// check if the player is already in the game queue
	if (self.game_queue.indexOf(data.userid) === -1){
		self.game_queue.push(data.userid);
	}

	// match players
	if (self.game_queue.length > 1){
		// remove the first 2 players from the queue
		var p1id = self.game_queue.pop();
		var p2id = self.game_queue.pop();
		var p1 = self.getUserWithId(p1id);
		var p2 = self.getUserWithId(p2id);
		
		var game_id = "game_" + Math.random().toString(36).substring(7);

		self.createGameObject(p1id, p2id, game_id);

		p1.currentGameId = game_id;
		p2.currentGameId = game_id;
		

		// send each a message
		if (io.sockets.connected[p1.socketId] && 
			io.sockets.connected[p2.socketId]) {
			io.to(p1.socketId).emit('gameMatched', 'for your eyes only 1');
			io.to(p2.socketId).emit('gameMatched', 'for your eyes only 2');
		}

		console.log("p1: " + p1);
		console.log("p2: " + p2);
		console.log(self.game_queue);
		console.log("game id: " + game_id);
		
	}

	console.log("Game Queue:");
	console.log(self.game_queue);
}

self.postLobbyMessage = function(data, socket, io){
	io.emit('updateLobbyChat', data);
}

self.addUserToLobby  = function(data, socket, io){
	// add user if they don't currently exist in the chat users list
	self.chatUsersList.push({username: data.username, userid: data.userid});
	self.socketid_map[socket.id] = data.userid;

	// self.addUserToActiveUsers(data.username, data.userid, socket.id);

	// send everyone the chat users list
	io.emit('updateLobbyUsersList', 
		{message: "User '" + data.username + "' has joined the lobby.", 
		 chatUsersList: self.chatUsersList});
}

// This is not very efficient ******************************
// This is not very efficient ******************************
// TO BE CHANGED !
self.removeUserFromLobby = function(socketid, io){
	var useridToRemove = self.socketid_map[socketid];
	var usernameToRemove = '';
	for (var i = 0; i < self.chatUsersList.length; i++){
		if (self.chatUsersList[i].userid == useridToRemove){
			console.log("user id to remove: " + useridToRemove);
			usernameToRemove = self.chatUsersList.username;
			self.chatUsersList.splice(i, 1);
		}
	}
	console.log(self.chatUsersList);

	// send everyone the chat users list
	io.emit('updateLobbyUsersList', 
		{message: "User '" + usernameToRemove + "' has left the lobby.", 
		 chatUsersList: self.chatUsersList});
}

function handleSocketRequests(io){
	io.on('connection', function (socket) {

		console.log("IO: ");
		console.log(io.id);
		console.log("SOCKET: ");
		console.log(socket.id);

		socket.on('disconnect', function(){
		    self.removeUserFromLobby(socket.id, io);
		});

		socket.on('addUserToLobby', 
			function(data){ self.addUserToLobby(data, socket, io); });

		// socket.on('addPlayerToQueue', self.addPlayerToQueue );
		socket.on('addPlayerToQueue', 
			function(data){ self.addPlayerToQueue(data, socket, io); });

		socket.on('postLobbyMessage', 
			function(data){ self.postLobbyMessage(data, socket, io); });
		
		socket.on('blah', 
			function(data){ console.log(data); });

		// console.log(socket);

		// socket.emit('news', { hello: 'world' });
		// socket.on('blah', function (data) {
		// 	console.log("NEW DATA:");
	 //    	console.log(data);
	 //  });
	});
}

self.initDataStructures = function(){
	self.socketid_map = {};	// hash map, index being 'socketid'
	self.active_users = {};	// hash map, index being 'userid'
	self.active_games = {};	// hash map, index being 'gameid'
	self.game_queue = [];	// list of 'userid's waiting to play a game

	self.chatMessagesList = [];
	self.chatUsersList = [];
}

function init(){
	var express = require('express');
	var app = express();

	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	app.use(express.static(process.cwd() + '/public'));
	server.listen(3000);

	self.initDataStructures();
	handleSocketRequests(io);
}

init();

exports.egg = {"hello": 5};

// var abc = require("./two.js");