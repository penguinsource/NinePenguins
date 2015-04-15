var http = require('http');
var util = require('util');
// var fs 	 = require('fs');
var mysql = require('mysql');

var self = this;

var DEBUG					= true;
var SERVER_LISTEN_PORT		= 3000;
var SERVER_LISTEN_PORT_TWO 	= 3001;

var connection = '';

// Connect to MySQL Database 
// -------------------------

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

// Game Controller functions
// -------------------------

self.addPlayerToQueue = function(data, socket, io){
	console.log("Adding player to queue !");

	// add player to queue
	var game_queue = 
		self.dataModel.addUserToQueue(data, data.userid, socket.id);
	
	// match players from the game queue
	if (game_queue.length > 1){
		// remove the first 2 players from the queue
		var p1id = game_queue.pop();
		var p2id = game_queue.pop();

		var gameObjCompact = self.dataModel.createGameObject(p1id, p2id);
		
		var p1Obj = self.dataModel.getUserWithId(p1id);
		var p2Obj = self.dataModel.getUserWithId(p2id);

		// send each a message
		if (io.sockets.connected[p1Obj.socketId] && 
			io.sockets.connected[p2Obj.socketId]) {
			io.to(p1Obj.socketId).emit('gameMatched', gameObjCompact);
			io.to(p2Obj.socketId).emit('gameMatched', gameObjCompact);
		}
	}
}

// Lobby Controller functions
// -------------------------

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

self.removeUserFromLobby = function(socketid, io){
	// This is not very efficient ******************************
	var retObj = self.dataModel.removeUserFromLobby(socketid);

	// send everyone the chat users list
	io.emit('updateLobbyUsersList', 
		{message: "User '" + retObj.usernameToRemove + "' has left the lobby.", 
		 chatUsersList: retObj.chatUsersList});
}

self.updateGameObject = function(gameObj){
	// check terminating conditions
	if (gameObj.p1PinsLeft < 3){
		// Player 2 wins !
	} else if (gameObj.p2PinsLeft < 3){
		// Player 1 wins !
	}

	if (gameObj.gameState === "place"){
		// if there are no more pins left to place for either player, 
		// then change the gameState
		if ( (gameObj.p1PlacePins < 1) && (gameObj.p2PlacePins < 1) ){
			gameObj.gameState = "move";
		}

		if (gameObj.p1PinsLeft < 4){
			console.log("!!!!!! player 1 can fly");
		}

		if (gameObj.p2PinsLeft < 4){
			console.log("!!!!!! player 2 can fly");
		}

	} else if (gameObj.gameState === "move"){
		// ****
		// have to do a check to see if the player that moves next can move at all

	} else if (gameObj.gameState === "fly"){

	}
}

self.buildCompactGameObj = function(gameObj){
	return { 
		"gameId": gameObj.gameId,
		"p1id": gameObj.p1id,
		"p2id": gameObj.p2id,
		"p1username": gameObj.p1userName,
		"p2username": gameObj.p2userName,
		"p1PlacePins": gameObj.p1PlacePins,
		"p2PlacePins": gameObj.p2PlacePins,
		"p1PinsLeft": gameObj.p1PinsLeft,
		"p2PinsLeft": gameObj.p2PinsLeft,
		"playerTurn": gameObj.playerTurn,
		"gameState": gameObj.gameState
	};
};

self.checkForMills = function(){
	
}

// data = {gameId: .., userid: .., pinIndex: ..}
self.userPlacedPin = function(data, io){
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);

	if (gameObj.playerTurn !== data.userid){
		console.log("ERROR ! Player Turn: " + gameObj.playerTurn +
			". Attempt by user with id: " + data.userid);
		return;
	}

	if (gameObj.board[data.pinIndex].control != 'pinFreePlace'){
		console.log("ERROR ! Pin Index '" + data.pinIndex + "' is not free." +
		 " User id in that position: " + gameObj.board[data.pinIndex].control);
		return;
	}
	console.log("USER PLACED PIN: player turn");
	console.log("player turn: " + gameObj.playerTurn);
	console.log("my id: " + data.userid);
	console.log("p2 id: " + gameObj.p2id);
	console.log("p1 id: " + gameObj.p1id);
	console.log("p1 id: " + gameObj.p1PlacePins);
	console.log("p1 id: " + gameObj.p2PlacePins);
	console.log("--------------------------");

	if (gameObj.gameState === "place"){
		// check if this is a valid move (if there are pins left to place)
		if ( (data.userid == gameObj.p1id) && (gameObj.p1PlacePins > 0) ){
			// player 1 placed a pin, send player 2 the updated game object
			gameObj.p1PlacePins--;

			// update game object
			gameObj.playerTurn = gameObj.p2id;
			console.log("user is p1 ");
			console.log("AND: " + gameObj.playerTurn);
			self.checkForMills();
			self.updateGameObject(gameObj);

			// send the updated game object to player 2
			var p2Obj = self.dataModel.getUserWithId(gameObj.p2id);
			// var gameObjCompact = self.buildCompactGameObj(gameObj);
			var returnObj = 
				{
					"gameId": gameObj.gameId,
					"playerid": gameObj.p1id,
					"pinIndex": data.pinIndex,
					"playerTurn": gameObj.playerTurn,
					"gameState": gameObj.gameState
				};
			// add the newly placed pin's index to the gameObjCompact
			

			if (io.sockets.connected[p2Obj.socketId]) {
				io.to(p2Obj.socketId).emit('placePin', returnObj);
			}
		} else if ( (data.userid == gameObj.p2id) && (gameObj.p2PlacePins > 0) ){
			// player 2 placed a pin, send player 1 the updated game object
			gameObj.p2PlacePins--;

			// update game object

			gameObj.playerTurn = gameObj.p1id;
			console.log("user is p2 ");
			console.log("AND: " + gameObj.playerTurn);
			self.checkForMills();
			self.updateGameObject(gameObj);

			// send the updated game object to player 1
			var p1Obj = self.dataModel.getUserWithId(gameObj.p1id);
			// var gameObjCompact = self.buildCompactGameObj(gameObj);
			var returnObj = 
				{
					"gameId": gameObj.gameId,
					"playerid": gameObj.p2id,
					"pinIndex": data.pinIndex,
					"playerTurn": gameObj.playerTurn,
					"gameState": gameObj.gameState
				};

			if (io.sockets.connected[p1Obj.socketId]) {
				io.to(p1Obj.socketId).emit('placePin', returnObj);
			}
		} else {
			console.log("WTFFFFFFFFFFFFFFFFFF");
		}
	}
	// gameObj.board[data.pinIndex].control = data.userid;

}

self.handleSocketRequests = function(io){
	io.on('connection', function (socket) {

		// console.log("IO: ");
		// console.log(io.id);
		// console.log("SOCKET: ");
		// console.log(socket.id);

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
		
		socket.on('placePin', 
			function(data){ self.userPlacedPin(data, io); });

	});
}

function init(){
	// setup server
	var express = require('express');
	var app = express();
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	app.use(express.static(process.cwd() + '/public'));
	server.listen(3000);

	// Data Model object
	var DataModel = require("./dataModel.js");
	self.dataModel = new DataModel();

	self.handleSocketRequests(io);
}

init();

exports.egg = {"hello": 5};

