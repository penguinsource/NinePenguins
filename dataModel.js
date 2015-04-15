var DataModel = function(){
	var self = this;
	self.socketid_map = {};	// hash map, index being 'socketid'
	self.active_users = {};	// hash map, index being 'userid'
	self.active_games = {};	// hash map, index being 'gameid'
	self.game_queue = [];	// list of 'userid's waiting to play a game

	self.chatMessagesList = [];
	self.chatUsersList = [];

	self.addUserToLobby = function(data, socketid){
		console.log("ADDING USER TO LOBBY !");
		// add user if they don't currently exist in the chat users list ********
		self.chatUsersList.push({username: data.username, userid: data.userid});
		self.socketid_map[socketid] = data.userid;

		return self.chatUsersList;
	}

	// This is not very efficient ******************************
	// This is not very efficient ******************************
	// TO BE CHANGED !
	self.removeUserFromLobby = function(socketid){
		var useridToRemove = self.socketid_map[socketid];
		var usernameToRemove = '';
		for (var i = 0; i < self.chatUsersList.length; i++){
			if (self.chatUsersList[i].userid == useridToRemove){
				usernameToRemove = self.chatUsersList.username;
				self.chatUsersList.splice(i, 1);
			}
		}
		
		return { usernameToRemove: usernameToRemove, 
				chatUsersList: self.chatUsersList};
	}

	self.addUserToQueue = function(data, userid, socketid){
		self.addUserToActiveUsers(data.username, userid, socketid);
		
		// check if the player is already in the game queue
		if (self.game_queue.indexOf(data.userid) === -1){
			self.game_queue.push(data.userid);
		}

		return self.game_queue;
	}

	// create object for user with id 'userid' if one doesn't exist already
	// in the database (or in cookies)
	self.addUserToActiveUsers = function(username, userid, socketid){
		if ( (self.active_users[userid] === undefined) || 
			 (self.active_users[userid] === null) ){
			
			// load data from database (if it exists) (or from cookies) 

			// else create a new active user object
			self.active_users[userid] = { "username": username,
										  "socketId": socketid, 
										  "gamesWon": 0,
										  "gamesLost": 0,
										  "currentGameId": null };
			return true;
		} else {
			// if user with 'userid' is already defined, then update their socketid
			self.active_users[userid].socketId = socketid;
			return false;
		}
	}

	self.getGameQueue = function(){
		return self.game_queue;
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

	self.createGameObject = function(player1id, player2id){
		console.log("Creating Game Object ..");

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
