var http = require('http');
// var util = require('util');
// var fs 	 = require('fs');
// var mysql = require('mysql');

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
	console.log("================");
	console.log(data);
	io.emit('updateLobbyChat', data);
}

self.addUserToLobby  = function(data, socket, io){
	self.dataModel.addUserToActiveUsers(data.username, data.userid, socket.id);
	var chatUserList = self.dataModel.getUserChatList();
	// send everyone the chat users list
	io.emit('updateLobbyUserList', 
		{message: "User '" + data.username + "' has joined the lobby.", 
		 chatUsersList: chatUserList});
}

self.removeActiveUser = function(socketid, io){
	// This is not very efficient ******************************
	var retObj = self.dataModel.removeActiveUser(socketid);
	var chatUserList = self.dataModel.getUserChatList();
	// send everyone the chat users list
	io.emit('updateLobbyUserList', 
		{message: "User has left the lobby.", 
		 chatUsersList: chatUserList});
}

self.updateGameObject = function(gameObj){
	// check terminating conditions
	if (gameObj.p1PinsLeft < 3){
		// Player 2 wins !
	} else if (gameObj.p2PinsLeft < 3){
		// Player 1 wins !
	}

	// if there are no more pins left to place for either player, 
	// then change the gameState
	if ( (gameObj.p1PlacePins < 1) && (gameObj.p2PlacePins < 1) ){
		gameObj.gameState = "move";
	} else {
		gameObj.gameState = "place";
	}

	if (gameObj.p1PinsLeft == 3){
		console.log("!!!!!! player 1 can fly");
	}

	if (gameObj.p2PinsLeft == 3){
		console.log("!!!!!! player 2 can fly");
	}

	// if (gameObj.gameState === "place"){

	// 	if (gameObj.p1PinsLeft == 3){
	// 		console.log("!!!!!! player 1 can fly");
	// 	}

	// 	if (gameObj.p2PinsLeft == 3){
	// 		console.log("!!!!!! player 2 can fly");
	// 	}

	// } else if (gameObj.gameState === "move"){
	// 	// ****
	// 	// have to do a check to see if the player that moves next can move at all

	// } else if (gameObj.gameState === "fly"){

	// }
}

// self.buildCompactGameObj = function(gameObj){
// 	return { 
// 		"gameId": gameObj.gameId,
// 		"p1id": gameObj.p1id,
// 		"p2id": gameObj.p2id,
// 		"p1username": gameObj.p1userName,
// 		"p2username": gameObj.p2userName,
// 		"p1PlacePins": gameObj.p1PlacePins,
// 		"p2PlacePins": gameObj.p2PlacePins,
// 		"p1PinsLeft": gameObj.p1PinsLeft,
// 		"p2PinsLeft": gameObj.p2PinsLeft,
// 		"playerTurn": gameObj.playerTurn,
// 		"gameState": gameObj.gameState
// 	};
// };

self.checkForMills = function(){
	console.log("Checking Mills");
}

self.userRemovedPin = function(data, io){
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);
	console.log("---> USER REMOVED PIN: " + gameObj.gameState);

	// check player turn
	if (gameObj.playerTurn !== data.userid){
		console.log("ERROR 2! Player Turn: " + gameObj.playerTurn +
			". Attempt by user with id: " + data.userid);
		return;
	}

	if (gameObj.gameState === "remove"){
		var otherPlayerPinName = (data.userid == gameObj.p1id) ? 'player2Pin' : 'player1Pin';
		var otherPlayerId = (data.userid == gameObj.p1id) ? gameObj.p2id : gameObj.p1id;
		console.log("Removing pin index: " + data.pinIndex, gameObj.board[data.pinIndex].control, otherPlayerId, otherPlayerPinName);
		// check to see if pinIndex is in a mill.. or if there are pins not in mills.. etc.
		if (gameObj.board[data.pinIndex].control === otherPlayerPinName){
			gameObj.board[data.pinIndex].control = "pinFreePlace";
			// console.log("control is: " + gameObj.board[data.pinIndex].control);
		}
		gameObj.playerTurn = otherPlayerId;
		self.updateGameObject(gameObj);


		// console.log("=============================================");
		// console.log("current player turn: " + gameObj.playerTurn);
		// gameObj.playerTurn = otherPlayerId;
		// console.log("updated player turn: " + gameObj.playerTurn);
		// console.log("=============================================");
		// gameObj.gameState = "place";
		
		// console.log("again player turn: " + gameObj.playerTurn);
		// console.log("=============================================");
		// send the updated game object to the other player
		var otherPlayerObj = self.dataModel.getUserWithId(otherPlayerId);
		// var gameObjCompact = self.buildCompactGameObj(gameObj);
		var returnObj = 
			{
				"gameId": gameObj.gameId,
				"pinIndex": data.pinIndex,
				"playerTurn": gameObj.playerTurn,
				"gameState": gameObj.gameState
			};

		if (io.sockets.connected[otherPlayerObj.socketId]) {
			io.to(otherPlayerObj.socketId).emit('removePin', returnObj);
		}

	} else {
		console.log("ERROR 4: this call should only be made when the gameState is 'remove'." + 
			" Game state: " + gameObj.gameState);

	}
}

// data = {gameId: .., userid: .., pinIndex: ..}
self.userPlacedPin = function(data, io){
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);
	console.log("game object:");
	console.log(gameObj);
	
	console.log("---> USER PLACED PIN: " + gameObj.gameState);
	// should check if the data.userid belongs in the game object gameObj
	// not so sure about this part yet.. because the userids are already checked
	// later below
	// ...

	// check player turn
	if (gameObj.playerTurn !== data.userid){
		console.log("ERROR 1! Player Turn: " + gameObj.playerTurn +
			". Attempt by user with id: " + data.userid);
		return;
	}

	// check if the pin's index is actually available
	if (gameObj.board[data.pinIndex].control != 'pinFreePlace'){
		console.log("ERROR 3! Pin Index '" + data.pinIndex + "' is not free." +
		 " User id in that position: " + gameObj.board[data.pinIndex].control);
		return;
	}

	if (gameObj.gameState === "place"){
		var playerPlacePins = (data.userid == gameObj.p1id) ? gameObj.p1PlacePins : gameObj.p2PlacePins;
		var playerPinName = (data.userid == gameObj.p1id) ? 'player1Pin' : 'player2Pin';
		var playerId = (data.userid == gameObj.p1id) ? gameObj.p1id : gameObj.p2id; 
		var otherPlayerId = (data.userid == gameObj.p1id) ? gameObj.p2id : gameObj.p1id; 

		console.log("p1 LEFT TO PLACE: " + gameObj.p1PlacePins);
		console.log("p2 LEFT TO PLACE: " + gameObj.p2PlacePins);

		if (playerPlacePins > 0){
			self.dataModel.decreasePlacePins(gameObj, playerId);

		console.log("p1 LEFT TO PLACE: " + gameObj.p1PlacePins);
		console.log("p2 LEFT TO PLACE: " + gameObj.p2PlacePins);

			// place pin in data.pinIndex
			gameObj.board[data.pinIndex].control = playerPinName;

			// has a mill been formed ?
			if (data.newMill){
				// check if a new mill has actually been formed
				if (self.dataModel.checkNewMill(data.gameId, playerPinName, data.pinIndex, data.newMill)){
					console.log("MILL CONFIRMED !!!!!");
					gameObj.gameState = "remove";
				} else {
					console.log("ERROR 5: A mill has been reported but that's not true.");
					gameObj.playerTurn = otherPlayerId;
				}
			} else {
				gameObj.playerTurn = otherPlayerId;
			}

			// send updates to the other player
			var otherPlayerObj = self.dataModel.getUserWithId(otherPlayerId);
			// var gameObjCompact = self.buildCompactGameObj(gameObj);
			var returnObj = 
				{
					"gameId": gameObj.gameId,
					"playerid": playerId,
					"pinIndex": data.pinIndex,
					"playerTurn": gameObj.playerTurn,
					"gameState": gameObj.gameState
				};
			// add the newly placed pin's index to the gameObjCompact
			
			// send player 2 the updated game object
			if (io.sockets.connected[otherPlayerObj.socketId]) {
				io.to(otherPlayerObj.socketId).emit('placePin', returnObj);
			}
		}
	}
}

self.handleSocketRequests = function(io){
	io.on('connection', function (socket) {

		// console.log("IO: ");
		// console.log("SOCKET: ");

		socket.on('disconnect', function(){
			console.log("USER Disconnected, socketid: " + socket.id + ", userid: " + 
				self.dataModel.getUserWithSocketid(socket.id));
		    self.removeActiveUser(socket.id, io);
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

		socket.on('removePin', 
			function(data){ self.userRemovedPin(data, io); });

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

