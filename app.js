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
// --------------------------
self.postLobbyMessage = function(data, socket, io){
	// console.log("================");
	// console.log(data);
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

// Game Controller functions
// --------------------------

// get gameObj, and check other requests
self.checkUser = function(gameId, userid, actionType){
	var gameObj = self.dataModel.getGameObjectWithId(gameId);
	if (!gameObj){
		var err = "ERROR! Game object with id '"+gameId+"' not found";
		return {"success": false, "message": err};
	}
	// check player turn && also validates that user with data.userid belongs
	// in this game
	if (gameObj.playerTurn !== userid){
		var err = "ERROR 1! Player Turn: '"+gameObj.playerTurn+
				  "'. Attempt by user with id: '"+userid+"'";
		return {"success": false, "message": err};
	}

	var myPlayerObj = self.dataModel.getMyPlayerObject(gameId, userid);

	// check my current state
	if (myPlayerObj.pState != actionType){
		var err = "ERROR ! Can't remove pin, my current state is "+
				  myPlayerObj.pState+", NOT " + actionType;
		return {"success": false, "message": err};
	}

	return {"success": true};
}

self.movePin = function(data, io){
	var checkUser = self.checkUser(data.gameId, data.userid, "move");
	if (!checkUser.success){
		// console.log(checkUser.message);
	}
	// get game object
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);
	// my player object represents the player who placed this pin
	var myPlayerObj = self.dataModel.getMyPlayerObject(data.gameId,
													data.userid);
	var otherPlayerObj = self.dataModel.getOtherPlayerObject(data.gameId,
															data.userid);
	var otherUserObj = self.dataModel.getUserWithId(otherPlayerObj.pid);

	// check if the pin's source index is actually available
	if (gameObj.board[data.sourceIndex].control != myPlayerObj.pBoardName){
		console.log("ERROR 3! Source pin Index '" + data.sourceIndex +
			"' does not belong to me." +
		 	" Control belongs to: " + gameObj.board[data.sourceIndex].control);
		return;
	}

	// check if the pin's target index is actually available
	if (gameObj.board[data.targetIndex].control != 'pinFreePlace'){
		console.log("ERROR 3! Pin Index '" + data.targetIndex +
					"' is not free. User id in that position: " +
		 			gameObj.board[data.targetIndex].control);
		return;
	}

	gameObj.board[data.sourceIndex].control = "pinFreePlace";
	gameObj.board[data.targetIndex].control = myPlayerObj.pBoardName;

	var millCheck = self.dataModel.checkNewMill(data.gameId, data.targetIndex);
	if ( data.newMill && (millCheck) ){
			// mill occured
			console.log("Mill Occured !");
			// set the current player's state to 'remove'
			myPlayerObj.pState = "remove";

			// send update to the other player
			// var otherUserObj = self.dataModel.getUserWithId(otherPlayerId);
			var returnObj =
				{
					"gameId": gameObj.gameId,
					"sourceIndex": data.sourceIndex,
					"targetIndex": data.targetIndex,
					"newMill": true,
					"otherPlayerState": myPlayerObj.pState,
					"testObj": data.testObj
				};
			if (io.sockets.connected[otherUserObj.socketId]) {
				io.to(otherUserObj.socketId).emit('movePin', returnObj);
			}
	} else {
		// check game winning conditions
		var gameCondition =
			self.checkGameConditions(false, data.gameId, data.userid);
		// game has been won
		if (gameCondition){
			// GAME WON **************
			console.log("GAME WON !!!!!!!");
		} else {	// game has NOT been won
			// if the player has 0 pins left to place, change state to 'move'
			if (myPlayerObj.pPlacePins == 0){
				gameState = "move";
			}

			// change player's turn
			gameObj.playerTurn = otherPlayerObj.pid;

			var returnObj =
				{
					"gameId": gameObj.gameId,
					"sourceIndex": data.sourceIndex,
					"targetIndex": data.targetIndex,
					"newMill": false,
					"otherPlayerState": myPlayerObj.pState,
					"testObj": data.testObj
				};
			if (io.sockets.connected[otherUserObj.socketId]) {
				io.to(otherUserObj.socketId).emit('movePin', returnObj);
			}
		}
	}
}

self.flyPin = function(data, io){
	// console.log("fly pin called");
	// console.log(data);
	var checkUser = self.checkUser(data.gameId, data.userid, "fly");
	if (!checkUser.success){
		// console.log(checkUser.message);
	}
	// get game object
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);
	// my player object represents the player who placed this pin
	var myPlayerObj = self.dataModel.getMyPlayerObject(data.gameId,
													data.userid);
	var otherPlayerObj = self.dataModel.getOtherPlayerObject(data.gameId,
															data.userid);
	var otherUserObj = self.dataModel.getUserWithId(otherPlayerObj.pid);

	// check if the pin's source index belongs to me
	if (gameObj.board[data.sourceIndex].control != myPlayerObj.pBoardName){
		console.log("ERROR 3! Source pin Index '" + data.sourceIndex +
			"' does not belong to me." +
		 	" Control belongs to: " + gameObj.board[data.sourceIndex].control);
		return;
	}

	// check if the pin's target index is actually available
	if (gameObj.board[data.targetIndex].control != 'pinFreePlace'){
		console.log("ERROR 3! Pin Index '" + data.targetIndex +
					"' is not free. User id in that position: " +
		 			gameObj.board[data.targetIndex].control);
		return;
	}

	// fly (move) pin
	gameObj.board[data.sourceIndex].control = "pinFreePlace";
	gameObj.board[data.targetIndex].control = myPlayerObj.pBoardName;

	var millCheck = self.dataModel.checkNewMill(data.gameId, data.targetIndex);
	if ( data.newMill && (millCheck) ){
			// mill occured
			console.log("Mill Occured !");
			// set the current player's state to 'remove'
			myPlayerObj.pState = "remove";

			// send update to the other player
			// var otherUserObj = self.dataModel.getUserWithId(otherPlayerId);
			var returnObj =
				{
					"gameId": gameObj.gameId,
					"sourceIndex": data.sourceIndex,
					"targetIndex": data.targetIndex,
					"newMill": true,
					"otherPlayerState": myPlayerObj.pState,
					"testObj": data.testObj
				};
			if (io.sockets.connected[otherUserObj.socketId]) {
				io.to(otherUserObj.socketId).emit('flyPin', returnObj);
			}
	} else {
		// check game winning conditions
		var gameCondition =
			self.checkGameConditions(false, data.gameId, data.userid);
		// game has been won
		if (gameCondition){
			// GAME WON **************
			console.log("GAME WON !!!!!!!");
		} else {	// game has NOT been won
			// if the player has 0 pins left to place, change state to 'move'
			if (myPlayerObj.pPlacePins == 0){
				gameState = "move";
			}

			// change player's turn
			gameObj.playerTurn = otherPlayerObj.pid;

			var returnObj =
				{
					"gameId": gameObj.gameId,
					"sourceIndex": data.sourceIndex,
					"targetIndex": data.targetIndex,
					"newMill": false,
					"otherPlayerState": myPlayerObj.pState,
					"testObj": data.testObj
				};
			if (io.sockets.connected[otherUserObj.socketId]) {
				io.to(otherUserObj.socketId).emit('movePin', returnObj);
			}
		}
	}

}

// data: {gameId, userid, pinIndex}
self.removePin = function(data, io){
	var checkUser = self.checkUser(data.gameId, data.userid, "remove");
	if (!checkUser.success){
		console.log(checkUser.message);
	}

	// get game object
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);

	// my player object represents the player who placed this pin
	var myPlayerObj = self.dataModel.getMyPlayerObject(data.gameId,
													   data.userid);
	var otherPlayerObj = self.dataModel.getOtherPlayerObject(data.gameId,
															 data.userid);
	var otherUserObj = self.dataModel.getUserWithId(otherPlayerObj.pid);

	// check if the pin to be removed belongs to the other player
	if (gameObj.board[data.pinIndex].control != otherPlayerObj.pBoardName){
		console.log("ERROR! Can't remove pin which doesnt belong to:");
		console.log(otherPlayerObj);
		return;
	}

	// check if pin at pinIndex can be removed
	if (!self.canRemovePin(data.gameId, data.pinIndex)){
		console.log("ERROR 2! Can't remove pin");
		return;
	}

	// remove player control from pinIndex
	gameObj.board[data.pinIndex].control = "pinFreePlace";
	// decrease the other player's pins left
	otherPlayerObj.pPinsLeft--;

	// get my current state
	if (myPlayerObj.pPlacePins > 0){
		myPlayerObj.pState = "place";
	} else if (myPlayerObj.pPinsLeft > 3){
		myPlayerObj.pState = "move";
	} else if (myPlayerObj.pPinsLeft == 3){
		myPlayerObj.pState = "fly";
	} else {
		console.log("ERROR at self.removePin(), while getting my state");
	}

	myPlayerObj.pState = self.dataModel.updatePlayerState(myPlayerObj);
	otherPlayerObj.pState = self.dataModel.updatePlayerState(otherPlayerObj);

	var gameConditions = self.checkGameConditions(true,
												  data.gameId,
												  data.userid);
	var gameWin = null;
	if (gameConditions){
		// game WON
		console.log("I WON THE GAME !");
		// console.log(myPlayerObj);
		gameWin = myPlayerObj.pid;
	} else {
		// console.log("i didnt win the game !");
		// changing player turn
		gameObj.playerTurn = otherPlayerObj.pid
	}

	// send update to the other player
	var returnObj =
		{
			"gameId": gameObj.gameId,
			"pinIndex": data.pinIndex,
			"playerTurn": gameObj.playerTurn,
			"gameOver": gameWin,
			"otherPlayerState": myPlayerObj.pState,
			"testObj": data.testObj
		};
	if (io.sockets.connected[otherUserObj.socketId]) {
		io.to(otherUserObj.socketId).emit('removePin', returnObj);
	}
}

self.canRemovePin = function(gameId, pinIndex){
	var gameObj = self.dataModel.getGameObjectWithId(gameId);
	// console.log("server, can remove pin: " + pinIndex);

	var newMill = self.dataModel.checkNewMill(gameId, pinIndex);

	// if the pin is not in a mill, it can be removed
	if (!newMill){
		// console.log("canRemovePin: pin is not in a mill, can be removed !");
		return true;
	} else {
		// get the player board name of the pin at pinIndex
		var tempBoardName = gameObj.board[pinIndex].control;
		var pinsInMills = [];

		var freePins = 0;
		// check if there are any pins that are not in mills
		// if there are any, then this pin is not removeable
		for (var i = 0; i < gameObj.board.length; i++){
			var tempPin = gameObj.board[i];
			if ((i != pinIndex) && (tempPin.control == tempBoardName)){
				// console.log("checking pin index for mills: " + pinIndex);
				var millCheck = self.dataModel.checkNewMill(gameId, i);
				// if there are any pins that are not in a mill, then pinIndex,
				// which is in a mill, can't be removed
				// console.log("MILL check:");
				// console.log(millCheck);
				if (!millCheck){
					// console.log("NO NO NO NO NO =============================");
					return false;
				}
			}
		}
		console.log("all in mills mboy");
		return true;
	}
}

// data = {userid, gameId, pinIndex}
self.placePin = function(data, io){
	// get game object
	var gameObj = self.dataModel.getGameObjectWithId(data.gameId);
	if (!gameObj){
		console.log("ERROR! Game object with id '"+data.gameId+"' not found");
		return;
	}

	// check player turn && also validates that user with data.userid belongs
	// in this game
	if (gameObj.playerTurn !== data.userid){
		console.log("ERROR 1! Player Turn: '"+gameObj.playerTurn+
			"'. Attempt by user with id: '"+data.userid+"'");
		return;
	}

	// my player object represents the player who placed this pin
	var myPlayerObj = self.dataModel.getMyPlayerObject(data.gameId, data.userid);
	var otherPlayerObj = self.dataModel.getOtherPlayerObject(data.gameId,
															data.userid);
	var otherUserObj = self.dataModel.getUserWithId(otherPlayerObj.pid);

	if (myPlayerObj.pState != "place"){
		console.log("ERROR ! Can't place pin, my current state is not place");
		return;
	}
	// check if the pin's index is actually available
	if (gameObj.board[data.pinIndex].control != 'pinFreePlace'){
		console.log("ERROR 3! Pin Index '" + data.pinIndex + "' is not free." +
		 " User id in that position: " + gameObj.board[data.pinIndex].control);
		return;
	}
	// check if current user has enough pins left to place another one;
	if (myPlayerObj.pPlacePins < 1){
		console.log("ERROR! Player '"+data.userid+
					"' has 0 pins left to place!");
		return;
	}
	// decrease the # of pins left to place for playerId
	myPlayerObj.pPlacePins--;
	// place pin in data.pinIndex
	gameObj.board[data.pinIndex].control = myPlayerObj.pBoardName;
	// check for mill
	var millCheck = self.dataModel.checkNewMill(data.gameId, data.pinIndex);
	if ( data.newMill && millCheck ){
			// mill occured
			newMill = true;
			// keep same player's turn
			var otherPlayerId = (data.userid == gameObj.p1id) ?
											     gameObj.p2id : gameObj.p1id;
			// set the current player's state to 'remove'
			myPlayerObj.pState = "remove";

			// send update to the other player
			var returnObj =
				{
					"gameId": gameObj.gameId,
					"pinIndex": data.pinIndex,
					"playerTurn": gameObj.playerTurn,
					"otherPlayerState": myPlayerObj.pState,
					"testObj": data.testObj
				};
				console.log("+ sending place pin:");
				console.log(returnObj);
			if (io.sockets.connected[otherUserObj.socketId]) {
				io.to(otherUserObj.socketId).emit('placePin', returnObj);
			}
	} else {
		// check game winning conditions
		var gameCondition =
			self.checkGameConditions(false, data.gameId, data.userid);
		// game has been won
		if (gameCondition){
			// GAME WON **************
		} else {	// game has NOT been won
			// if the player has 0 pins left to place, change state to 'move'
			if (myPlayerObj.pPlacePins == 0){
				myPlayerObj.pState = "move";
			}

			// change player's turn
			gameObj.playerTurn = otherPlayerObj.pid;

			var returnObj =
				{
					"gameId": gameObj.gameId,
					"pinIndex": data.pinIndex,
					"playerTurn": gameObj.playerTurn,
					"otherPlayerState": myPlayerObj.pState,
					"testObj": data.testObj
				};
				console.log("+ sending place pin to index: " + data.pinIndex);
				// console.log(returnObj);
			if (io.sockets.connected[otherUserObj.socketId]) {
				io.to(otherUserObj.socketId).emit('placePin', returnObj);
			}
		}
	}
}

// if a pin has been removed, removeAction should be 'true'
self.checkGameConditions = function(removeAction, gameId, userid){
	var myPlayerObject = self.dataModel.getMyPlayerObject(gameId, userid);
	var otherPlayerObj = self.dataModel.getOtherPlayerObject(gameId, userid);
	var gameObj = self.dataModel.getGameObjectWithId(gameId);

	// check to see if either player has less than 3 overall pins
	if (removeAction){
		if (otherPlayerObj.pPinsLeft < 3){
			// myPlayerObject wins
			// console.log("player with id "+otherPlayerObj.pid +
					    // " has < 3 pins left. p2 wins");
			return true;
		}
	}

	// check if the other player can move any pin..
	if ( (otherPlayerObj.pState == "place") ||
		 (otherPlayerObj.pState == "fly") ){
		return false;
	} else if (otherPlayerObj.pState == "move"){
		// go through each pin that belongs to the other player
		// if any one of the pins has a free neighbour they can move to
		// then game has not been won, return false.
		for (var i = 0; i < gameObj.board.length; i++){
			var tempPin = gameObj.board[i];
			if (tempPin.control == otherPlayerObj.pBoardName){
				// now check if pin has any free neighbours
				for (var k = 0; k < tempPin.vNeighbours.length; k++){
					var t2Pin = gameObj.board[tempPin.vNeighbours[k]];
					if (t2Pin.control == self.freePinBoardName){
						// console.log("_+_+_+_+_+_+_ hello 1");
						return false;	// game not won
					}
				}

			}
		}
		// console.log("_+_+_+_+_+_+_ hello 2 ");
		return true;	// game won
	}
}

self.handleSocketRequests = function(io){
	io.on('connection', function (socket) {

		// console.log("IO: ");
		// console.log("SOCKET: ");

		socket.on('disconnect', function(){
			// console.log("USER Disconnected, socketid: " + socket.id +
			// ", userid: " +
			self.dataModel.getUserWithSocketid(socket.id);
		    self.removeActiveUser(socket.id, io);
		});

		socket.on('addUserToLobby',
			function(data){ self.addUserToLobby(data, socket, io); });

		// socket.on('addPlayerToQueue', self.addPlayerToQueue );
		socket.on('addPlayerToQueue',
			function(data){ self.addPlayerToQueue(data, socket, io); });

		socket.on('postLobbyMessage',
			function(data){ self.postLobbyMessage(data, socket, io); });

		socket.on('placePin', function(data){ self.placePin(data, io); });
		socket.on('movePin', function(data){ self.movePin(data, io); });
		socket.on('flyPin', function(data){ self.movePin(data, io); });
		socket.on('removePin', function(data){ self.removePin(data, io); });		
	});
}

self.initVariables = function(){
	self.freePinBoardName = "pinFreePlace";
}

function init(){
	// setup server
	var express = require('express');
	var app = express();
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	app.use(express.static(process.cwd() + '/public'));
	// server.listen(SERVER_LISTEN_PORT, '2601:589:2:5fc0:f959:f5dd:5932:49be');
	server.listen(SERVER_LISTEN_PORT);
	// Data Model object
	var DataModel = require("./dataModel.js");
	self.dataModel = new DataModel();
	self.initVariables();
	self.handleSocketRequests(io);
}

init();

exports.egg = {"hello": 5};
