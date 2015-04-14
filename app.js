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

// self.createGameObject = function(player1id, player2id){
// 	console.log("Creating Game Object ..");
// 	var gameObj = { "p1id": player1id, 
// 					"p2id": player2id,
// 					"p1_pins": 9,
// 					"p2_pins": 9,
// 					"currentPlayerTurn": player1id,
// 					"currentGameState": "place"	// {place, move, fly}
// 				  };

// 	var game_id = "game_" + Math.random().toString(36).substring(7);
// 	self.active_users[player1id].currentGameId = game_id;
// 	self.active_users[player2id].currentGameId = game_id;

// 	gameObj.board = 
// 		[
// 		{"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 1 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 9 ], "hNeighbours": [ 0, 2 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 3 ], "hNeighbours": [ 1 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 2, 4 ], "hNeighbours": [ 11 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 3 ], "hNeighbours": [ 5 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 13 ], "hNeighbours": [ 4, 6 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 5 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 0, 6 ], "hNeighbours": [ 15 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 15 ], "hNeighbours": [ 9 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 1, 17 ], "hNeighbours": [ 8, 10 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 11 ], "hNeighbours": [ 9 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 10, 12 ], "hNeighbours": [ 3, 19 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 11 ], "hNeighbours": [ 13 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 5, 21 ], "hNeighbours": [ 12, 14 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 15 ], "hNeighbours": [ 13 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 8, 14 ], "hNeighbours": [ 7, 23 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 23 ], "hNeighbours": [ 17 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 9 ], "hNeighbours": [ 16, 18 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 19 ], "hNeighbours": [ 17 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 18, 20 ], "hNeighbours": [ 11 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 19 ], "hNeighbours": [ 21 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 13 ], "hNeighbours": [ 20, 22 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 23 ], "hNeighbours": [ 21 ] },
// 		{"control": "pinFreePlace", "vNeighbours": [ 16, 22 ], "hNeighbours": [ 15 ] }
// 		];

// 	self.active_games[game_id] = gameObj;
// 	var gameObjCompact = {  "game_id": game_id,
// 							"p1id": player1id, 
// 							"p2id": player2id,
// 							"p1_pins": 9,
// 							"p2_pins": 9,
// 							"currentPlayerTurn": player1id,
// 							"currentGameState": "place"	// {place, move, fly}
// 				  		};
// 	return gameObjCompact;
// }

// NOT USED YET !
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
		var p1Obj = self.active_users[p1id];
		var p2Obj = self.active_users[p2id];

		var gameObjCompact = self.createGameObject(p1id, p2id);
		
		console.log("==================");
		console.log(gameObjCompact);

		// send each a message
		if (io.sockets.connected[p1Obj.socketId] && 
			io.sockets.connected[p2Obj.socketId]) {
			io.to(p1.socketId).emit('gameMatched', gameObjCompact);
			io.to(p2.socketId).emit('gameMatched', gameObjCompact);
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
	var chatUsersList = self.dataModel.addUserToLobby(data, socket.id);

	// send everyone the chat users list
	io.emit('updateLobbyUsersList', 
		{message: "User '" + data.username + "' has joined the lobby.", 
		 chatUsersList: chatUsersList});
}

// This is not very efficient ******************************
// This is not very efficient ******************************
// TO BE CHANGED !
self.removeUserFromLobby = function(socketid, io){
	var retObj = self.dataModel.removeUserFromLobby(socketid);

	// send everyone the chat users list
	io.emit('updateLobbyUsersList', 
		{message: "User '" + retObj.usernameToRemove + "' has left the lobby.", 
		 chatUsersList: retObj.chatUsersList});
}

self.handleSocketRequests = function(io){
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
	// setup server
	var express = require('express');
	var app = express();
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	app.use(express.static(process.cwd() + '/public'));
	server.listen(3000);

	var DataModel = require("./dataModel.js");
	self.dataModel = new DataModel();

	// self.initDataStructures();
	self.handleSocketRequests(io);
}

init();

exports.egg = {"hello": 5};

