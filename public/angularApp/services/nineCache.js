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
	
	self.logoClass = "logo";
	self.showTopGameButtons = true;
		// "gameId": game_id,
		// "p1id": player1id, 
		// "p2id": player2id,
		// "p1pins": 9,
		// "p2pins": 9,
		// "playerTurn": player1id,
		// "gameState": "place"	// {place, move, fly}
		// "otherPlayerId": other_player_id

	// level 0 - original
	// level 1 - minimized
	self.scalePage = function(level){
		if (level == 0){
			self.logoClass = "logo";
		} else if (level == 1){
			self.logoClass = "logoMin";
		}
	}

	self.isVisibleTopGameBtns = function(){
		return self.showTopGameButtons;
	}

	self.setVisibleTopGameBtns = function(booleanVal){
		self.showTopGameButtons = booleanVal;	// true or false
	}

	self.initGameObj = function(data){
		self.gameObj = data;
		if (self.gameObj.p1id === self.userData.id){
			self.gameObj.otherPlayerId = self.gameObj.p2id;
		} else {
			self.gameObj.otherPlayerId = self.gameObj.p1id;
		}
	}

	self.getMyPlayerObject = function(){
		if (self.gameObj.p1Obj.pid == self.userData.id){
			return self.gameObj.p1Obj;
		} else if (self.gameObj.p2Obj.pid == self.userData.id){
			return self.gameObj.p2Obj;
		}
	}

	self.getOtherPlayerObject = function(){
		if (self.gameObj.p1Obj.pid == self.userData.id){
			return self.gameObj.p2Obj;
		} else if (self.gameObj.p2Obj.pid == self.userData.id){
			return self.gameObj.p1Obj;
		}
	}

	self.setupAccount = function(type, data){
		// if (!self.mySocket){
			// self.connectToServer();
		// }
		
		if (type === 'guest'){
			self.userType = 'guest';
			self.userData.id = 'guest_' + window.Math.random().toString(36).substring(7);
			self.username = self.userData.id;
		} else if (type === 'facebook'){
			self.userType = 'facebook';
			if (data){
				self.userData = data;
			}
			self.username = self.userData.first_name;
		}

		self.mySocket.emit('addUserToLobby', 
			{ username: self.username, 
			  userid: 	self.userData.id });
	}

	self.connectToServer = function(){
		var serverAddr = '';
		// var serverAddr = 'http://50.65.103.143:3000/';
		// serverAddr = 'http://142.244.5.95:3000/';
		serverAddr = "http://localhost:3000/";
		// serverAddr = '65.34.248.251:3000/';
		// serverAddr = '[2601:589:2:5fc0:b4cc:a879:81e8:5b2f]:3000/';
		self.mySocket = io.connect(serverAddr);
	}

});
