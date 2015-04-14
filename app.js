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
	if (gameObj.gameState === "place"){
		// if there are no more pins left to place for either player, 
		// then change the gameState
		if ( (gameObj.p1pins < 1) && (gameObj.p2pins < 1) ){
			gameObj.gameState = "move";
		}
	}
}

// data = {gameId: .., userid: .., pinIndex: ..}
self.userPlacedPin = function(data, io){
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);
	console.log("GAME OBJECT:");
	console.log(gameObj);

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

	if (gameObj.gameState === "place"){
		// check if this is a valid move (if there are pins left to place)
		if ( (data.userid === gameObj.p1id) && (gameObj.p1pins > 0) ){
			// player 1 placed a pin, send player 2 the updated game object
			gameObj.p1pins--;
			// update game status
			updateGameObject(gameObj);
		} else {
			// player 2 placed a pin, send player 1 the updated game object
			gameObj.p2pins--;
			// update game status
			updateGameObject(gameObj);
		}

		io.to(p1Obj.socketId).emit('gameMatched', gameObjCompact);

	}
	// gameObj.board[data.pinIndex].control = data.userid;

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

