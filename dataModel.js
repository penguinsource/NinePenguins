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
				console.log("user id to remove: " + useridToRemove);
				usernameToRemove = self.chatUsersList.username;
				self.chatUsersList.splice(i, 1);
			}
		}
		
		return { usernameToRemove: usernameToRemove, 
				chatUsersList: self.chatUsersList};
	}
}

// var createGameObject = function(player1id, player2id, mainModule){

// 	console.log("================================>>>>>>>>>");
// 	console.log(mainModule.egg);
// 	console.log("Creating Game Object ..");
// 	var gameObj = { "p1id": player1id, 
// 					"p2id": player2id,
// 					"p1_pins": 9,
// 					"p2_pins": 9,
// 					"currentPlayerTurn": player1id,
// 					"currentGameState": "place"	// {place, move, fly}
// 				  };

// 	var game_id = "game_" + Math.random().toString(36).substring(7);
// 	mainModule.active_users[player1id].currentGameId = game_id;
// 	mainModule.active_users[player2id].currentGameId = game_id;

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

// 	mainModule.active_games[game_id] = gameObj;
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

module.exports = DataModel;