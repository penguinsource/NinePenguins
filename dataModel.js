var DataModel = function(){
	var self = this;
	self.socketid_map = {};	// hash map, index being 'socketid' (socketid => userid)
	self.active_users = {};	// hash map, index being 'userid'
	self.active_games = {};	// hash map, index being 'gameid'
	self.game_queue = [];	// list of 'userid's waiting to play a game
	self.cached_users = {};	// hash map of users that are not active, index being 'userid'

	// ***** NOT IN USE YET !
	self.chatMessagesList = [];	

	// compact hash map of active_users; used for the lobby chat user list
	self.active_users_compact = {};	


	// ******************************************************************
	// ******************************************************************


	// self.addUserToLobby = function(data, socketid){
	// 	console.log("ADDING USER TO LOBBY !");
	// 	console.log("socket id: " + socketid + ", userid: " + data.userid);
	// 	console.log("is socket already ? ");
	// 	console.log(self.socketid_map[socketid]);
	// 	// var newUser = self.addUserToActiveUsers(data.username, userid, socketid);

	// 	// if it's a new user.. 
	// 	if (self.addUserToActiveUsers(data.username, userid, socketid)){
	// 		// check if user exists in the chatroom at the moment
	// 	} else {

	// 	}
	// 	// socket already exists - user either logged in or logged out of a service
	// 	if (self.socketid_map[socketid]){
	// 		console.log("Same Socket - updating user id and username");
	// 		// update the userid that is mapped to the socketid
	// 		self.socketid_map[socketid] = data.userid;

	// 		return self.chatUsersList;
	// 	} else if (self.socketid_map[socketid] == data.userid){
	// 		// same user id - user refreshed the page


	// 	}
	// 	// if (self.chatUsersList.indexOf())


	// 	self.chatUsersList.push(data.userid);



	// 	// console.log("INDEX OF:");
	// 	// console.log(self.chatUsersList);
	// 	// console.log(data.userid);
	// 	// console.log(self.chatUsersList.indexOf(data.userid));
		
	// 	// add user if they don't currently exist in the chat users list ********
	// 	// self.chatUsersList.push({username: data.username, userid: data.userid});
	// 	self.socketid_map[socketid] = data.userid;

	// 	return self.chatUsersList;
	// }

	// create object for user with id 'userid' if one doesn't exist already
	// in the database (or in cookies)
	self.addUserToActiveUsers = function(username, userid, socketid){
		// console.log("adding to active users, username: " + username + ", userid: " + userid);
		// console.log();
		if ( (self.active_users[userid] === undefined) || 
			 (self.active_users[userid] === null) ){
			
			// load data from database (if it exists) (or from cookies) 
				// self.active_users[userid] = database data..

			// else create a new active user object
			self.active_users[userid] = {
									"username": username,
								  	"socketId": socketid, 
								  	"gamesWon": 0,
									"gamesLost": 0,
									"currentGameId": null
								 };

			var lastUserid = self.socketid_map[socketid];
			// socket is already mapped to an existing user id, so user logged in/out of a service
			// update socket mapping, active_users and active_users_compact
			if (lastUserid){
				// console.log("SOCKET ALREADY MAPPED TO AN id: " + lastUserid);
				// console.log("Chat Active Users (compact) Before:");
				// console.log(self.active_users_compact);
				// cache the old user id and its data
				self.cached_users[lastUserid] = self.active_users[lastUserid];
				// ^ save it to database

				// delete the inactive user data
				delete self.active_users[lastUserid];
				delete self.active_users_compact[lastUserid];
				// console.log("active users:");
				// console.log(self.active_users);
			}

			self.active_users_compact[userid] = username;
			self.socketid_map[socketid] = userid;
			
			// console.log("Chat Active Users (compact) CURRENT:");
			// console.log(self.active_users_compact);

			return true;
		} else {
			// console.log("userid: " + userid + " is already an active user");
			// if user with 'userid' is already an active user
			// that means that the user might still be in the chat room
			// so remove the last userid that was in the active user lists
			var lastUserid = self.socketid_map[socketid];
			// console.log("last user id: ");
			// console.log(lastUserid);
			delete self.active_users[lastUserid];
			delete self.active_users_compact[lastUserid];
			// update their socketid
			self.active_users[userid].socketId = socketid;
			self.socketid_map[socketid] = userid;
			return false;
		}
	}

	self.getUserChatList = function(){
		// console.log("LIST:");
		// console.log(self.active_users_compact);
		return self.active_users_compact;
	}

	self.removeActiveUser = function(socketid){
		var userid = self.socketid_map[socketid];
		var usernameToRemove = '';
		
		// console.log("DISCONNECTING: " + self.socketid_map[socketid]);

		// cache the data of the user that left
		self.cached_users[userid] = self.active_users[userid];

		// check if the user is currently in the game queue / remove them if they are
		var userGQindex = self.game_queue.indexOf(userid);
		if (userGQindex != -1){
			self.game_queue.splice(userGQindex);
		}

		// remove the data from the active hash maps
		delete self.active_users_compact[userid];
		delete self.active_users[userid];
		delete self.socketid_map[userid];
	}

	self.addUserToQueue = function(data, userid, socketid){
		// self.addUserToActiveUsers(data.username, userid, socketid);
		
		// check if the player is already in the game queue
		if (self.game_queue.indexOf(data.userid) === -1){
			self.game_queue.push(data.userid);
		}

		return self.game_queue;
	}

	self.decreasePlacePins = function(gameObj, playerid){
		if (gameObj.p1id == playerid){
			gameObj.p1PlacePins--;
		} else if (gameObj.p2id == playerid){
			gameObj.p2PlacePins--;
		} else {
			console.log("ERROR 7: dataModel, decreasePlacePins function");
		}
	}

	self.getGameQueue = function(){
		return self.game_queue;
	}

	self.getUserWithSocketid = function(socketid){
		return self.socketid_map[socketid];
	}

	self.getUserWithId = function(userid){
		if (self.active_users[userid]){
			return self.active_users[userid];
		} else {
			console.log("ERROR ! User with id: " + userid + " doesn't exist !");
			return null;
		}
	}

	self.getGameObjectWithId = function(gameId){
		if (self.active_games[gameId]){
			return self.active_games[gameId];
		} else {
			return null;
		}
	}

	self.createBasicGameObject = function(gameId, player1id, player2id){
		return {"gameId": gameId,
				"p1id": player1id, 
				"p2id": player2id,
				"p1userName": '',
				"p2userName": '',
				"p1PlacePins": 9,	// used only for gameState 'place'
				"p2PlacePins": 9,	// used only for gameState 'place'
				"p1PinsLeft":9,
				"p2PinsLeft":9,
				"playerTurn": player1id,
				"gameState": "place"	// {place, move, fly}
			};
	}

	self.checkNewMill = function(gameId, playerNo, newPinIndex, millData){
		var gameObj = self.active_games[gameId];
		var neighPinIndex1 = -1;
		var neighPinIndex2 = -1;

		if (millData.millType === "vertical"){
			if (gameObj.board[newPinIndex].vNeighbours.length == 2){
				neighPinIndex1 = gameObj.board[newPinIndex].vNeighbours[0];
				neighPinIndex2 = gameObj.board[newPinIndex].vNeighbours[1];
				// console.log("!! V 2 neighbours: " + gameObj.board[newPinIndex].vNeighbours.length);
			} else {
				neighPinIndex1 = gameObj.board[newPinIndex].vNeighbours[0];
				var neighbourPin = gameObj.board[neighPinIndex1];
				for (var i = 0; i < neighbourPin.vNeighbours.length; i++){
					if (neighbourPin.vNeighbours[i] != newPinIndex){
						neighPinIndex2 = neighbourPin.vNeighbours[i];
					}
				}
				// console.log("!! V 1 neighbour: " + gameObj.board[newPinIndex].vNeighbours.length);
			}
		} else if (millData.millType === "horizontal"){
			if (gameObj.board[newPinIndex].hNeighbours.length == 2){
				neighPinIndex1 = gameObj.board[newPinIndex].hNeighbours[0];
				neighPinIndex2 = gameObj.board[newPinIndex].hNeighbours[1];
				// console.log("!! H 2 neighbours: " + gameObj.board[newPinIndex].hNeighbours.length);
			} else {
				neighPinIndex1 = gameObj.board[newPinIndex].hNeighbours[0];
				var neighbourPin = gameObj.board[neighPinIndex1];
				for (var i = 0; i < neighbourPin.hNeighbours.length; i++){
					if (neighbourPin.hNeighbours[i] != newPinIndex){
						neighPinIndex2 = neighbourPin.hNeighbours[i];
					}
				}
				// console.log("!! H 1 neighbour: " + gameObj.board[newPinIndex].hNeighbours.length);
			}
		}

		if ( (gameObj.board[newPinIndex].control === gameObj.board[neighPinIndex1].control) &&
			 (gameObj.board[neighPinIndex1].control === gameObj.board[neighPinIndex2].control) &&
			 (gameObj.board[newPinIndex].control === playerNo) ){
			return true;
		} else {
			return false;
		}
		// console.log("=-=-=-=-=-=-=-=");
		// console.log("Data received:");
		// console.log(millData);
		// console.log();
		// console.log("Data calculated:");
		// console.log(newPinIndex, neighPinIndex1, neighPinIndex2);
	}

	self.createGameObject = function(player1id, player2id){
		// console.log("Creating Game Object ..");

		var gameId = "game_" + Math.random().toString(36).substring(7);
		self.active_users[player1id].currentGameId = gameId;
		self.active_users[player2id].currentGameId = gameId;

		var gameObj = self.createBasicGameObject(gameId, player1id, player2id);

		gameObj.board = 
			[
				{"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 1 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 9 ], "hNeighbours": [ 0, 2 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 3 ], "hNeighbours": [ 1 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 2, 4 ], "hNeighbours": [ 11 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 3 ], "hNeighbours": [ 5 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 13 ], "hNeighbours": [ 4, 6 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 5 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 0, 6 ], "hNeighbours": [ 15 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 15 ], "hNeighbours": [ 9 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 1, 17 ], "hNeighbours": [ 8, 10 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 11 ], "hNeighbours": [ 9 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 10, 12 ], "hNeighbours": [ 3, 19 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 11 ], "hNeighbours": [ 13 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 5, 21 ], "hNeighbours": [ 12, 14 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 15 ], "hNeighbours": [ 13 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 8, 14 ], "hNeighbours": [ 7, 23 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 23 ], "hNeighbours": [ 17 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 9 ], "hNeighbours": [ 16, 18 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 19 ], "hNeighbours": [ 17 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 18, 20 ], "hNeighbours": [ 11 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 19 ], "hNeighbours": [ 21 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 13 ], "hNeighbours": [ 20, 22 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 23 ], "hNeighbours": [ 21 ] },
				{"control": "pinFreePlace", "vNeighbours": [ 16, 22 ], "hNeighbours": [ 15 ] }
			];

		self.active_games[gameId] = gameObj;
		var gameObjCompact = self.createBasicGameObject(gameId, player1id, player2id);

		return gameObjCompact;
	}
}

module.exports = DataModel;
