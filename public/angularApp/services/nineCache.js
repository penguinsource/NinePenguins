var pokeApp = angular.module("nineApp");

// used to cache various data for optimization and store some global vars
pokeApp.service('NineCache', function(){
	var self = this;

	self.userData = {};
		// "id": userid
	self.userType = 'guest';	// {guest, facebook}
	self.username = '';
	self.mySocket = null;
	self.gameObj = {};
		// "gameId": game_id,
		// "p1id": player1id, 
		// "p2id": player2id,
		// "p1pins": 9,
		// "p2pins": 9,
		// "playerTurn": player1id,
		// "gameState": "place"	// {place, move, fly}
		// "otherPlayerId": other_player_id

	self.initGameObj = function(data){
		self.gameObj = data;
		if (self.gameObj.p1id === self.userData.id){
			self.gameObj.otherPlayerId = self.gameObj.p2id;
		} else {
			self.gameObj.otherPlayerId = self.gameObj.p1id;
		}
	}

	this.setUserTypeToGuest = function(){
		self.userType = 'guest';	// !!!!!!!!!!! set random char name
	}

});
