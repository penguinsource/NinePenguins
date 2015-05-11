var nineApp = angular.module("nineApp");

nineApp.controller('gameController', 
							function($scope, $http, $stateParams, NineCache){
	var self = this;

	// Helper Functions
	self.isEven = function(n) {
	  return n === parseFloat(n)? !(n%2) : void 0;
	}

	self.areAllEqual = function(one, two, three){
		if ( (one === two) && (two === three) ){
			return true;
		} else {
			return false;
		}
	}

	self.checkForMills = function(pinIndex){
		var pinBtn = NineCache.gameObj.board[pinIndex];
		if (self.isEven(pinIndex)){
			console.log("its even !");

			// get the 2 horizontal pins connected to pinBtn
			var middlePinInd = pinBtn.hNeighbours[0];
			var middlePin = self.board[middlePinInd];
			var otherPin = {};
			var otherPinInd = -1;
			for (var i = 0; i < middlePin.hNeighbours.length; i++){
				if (middlePin.hNeighbours[i] != pinIndex){
					otherPinInd = middlePin.hNeighbours[i];
					otherPin = self.board[otherPinInd];
				}
			}

			// check for horizontal mill
			if (self.areAllEqual(pinBtn.control, middlePin.control, otherPin.control)){
			// if ((pinBtn.control === middlePin.control) 
			// 				&& (middlePin.control === otherPin.control)){
				console.log("!!!!!!Horizontal Mill, indices: " 
							+ pinIndex, middlePinInd, otherPinInd);
				return { "millType" : 'horizontal', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
			}
			// console.log("my pin index is: " + pinIndex);
			// console.log("middle pin index is: " + middlePinInd);
			// console.log("other pin index is: " + otherPinInd);

			// get the 2 vertical pins connected to pinBtn
			middlePinInd = pinBtn.vNeighbours[0];
			middlePin = self.board[middlePinInd];
			for (var i = 0; i < middlePin.vNeighbours.length; i++){
				if (middlePin.vNeighbours[i] != pinIndex){
					otherPinInd = middlePin.vNeighbours[i];
					otherPin = self.board[otherPinInd];
				}
			}

			// check for vertical mill
			if ((pinBtn.control === middlePin.control) 
							&& (middlePin.control === otherPin.control)){
				console.log("Vertical Mill, indices: " 
							+ pinIndex, middlePinInd, otherPinInd);
				return { "millType" : 'vertical', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
			}
		} else {
			console.log("its odd !");
			
			var middlePinInd = -1;
			var middlePin = {};
			var otherPinInd = -1;
			var otherPin = {};

			// check for horizontal mill
			// case 1, pinBtn only has 1 horizontal neighbour
			if (pinBtn.hNeighbours.length == 1){
				middlePinInd = pinBtn.hNeighbours[0];
				var middlePin = self.board[middlePinInd];
				for (var i = 0; i < middlePin.hNeighbours.length; i++){
					if (middlePin.hNeighbours[i] != pinIndex){
						otherPinInd = middlePin.hNeighbours[i];
						otherPin = self.board[otherPinInd];
					}
				}

				if ( (pinBtn.control === middlePin.control) 
								&& (middlePin.control === otherPin.control) ){
					console.log("Horizontal Mill case 1, indices: " 
									+ pinIndex, middlePinInd, otherPinInd);
					return { "millType" : 'horizontal', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			} else { // case 2, pinBtn has 2 horizontal neighbours
				var nPinOneInd = pinBtn.hNeighbours[0];
				var nPinTwoInd = pinBtn.hNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) 
							&& (pinBtn.control === neighbourPinTwo.control) ){
					console.log("Horizontal Mill case 2, indices: " 
							+ pinIndex, nPinOneInd, nPinTwoInd);
					return { "millType" : 'horizontal', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			}
			
			// check for vertical mill
			// case 1, pinBtn only has 1 vertical neighbour
			if (pinBtn.vNeighbours.length == 1){
				middlePinInd = pinBtn.vNeighbours[0];
				var middlePin = self.board[middlePinInd];
				for (var i = 0; i < middlePin.vNeighbours.length; i++){
					if (middlePin.vNeighbours[i] != pinIndex){
						otherPinInd = middlePin.vNeighbours[i];
						otherPin = self.board[otherPinInd];
					}
				}

				if ( (pinBtn.control === middlePin.control) && (middlePin.control === otherPin.control) ){
					console.log("Vertical Mill case 1, indices: " + pinIndex, middlePinInd, otherPinInd);
					return { "millType" : 'vertical', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			} else { // case 2, pinBtn has 2 vertical neighbours
				var nPinOneInd = pinBtn.vNeighbours[0];
				var nPinTwoInd = pinBtn.vNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) && (pinBtn.control === neighbourPinTwo.control) ){
					console.log("Vertical Mill case 2, indices: " + pinIndex, nPinOneInd, nPinTwoInd);
					return { "millType" : 'vertical', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			}

		}
		return false;
	}

	self.clickEvent = function(pinBtn, pinIndex){
		var pinBtn = NineCache.gameObj.board[pinIndex];
		// console.log("click event, pinIndex " + pinIndex);
		// console.log(pinBtn);
		console.log("Current GAME STATE:" + NineCache.gameObj.gameState, pinIndex);
		if (NineCache.gameObj.gameState === 'place'){
			self.placePin(pinBtn, pinIndex, self.playerColor);
		} else if (NineCache.gameObj.gameState === 'remove'){
			// self.selectedPin = pinBtn;
			console.log("removing pin with index: " + pinIndex);
			self.removePin(pinIndex, self.playerColor);
		} else if (NineCache.gameObj.gameState === 'move'){

		}
	}


	self.onDragStart = function(evt){
		console.log("ondragstart !!");
		console.log(evt);
	}

	self.displayPossibleMoves = function(pinBtn){
		if (NineCache.gameObj.gameState === 'move'){

		} else if (NineCache.gameObj.gameState === 'fly'){

		}
	}

	self.highlightRemovablePins = function(){
		NineCache.gameObj.gameState = 'remove';
		self.calcRemovablePins();
	}

	// if true, then the user can remove pins that are currently
	// in a mill (have property 'isMill' set to true)
	self.calcRemovablePins = function(){
		var board = NineCache.gameObj.board;
		self.otherPlayerNoPins = 0;
		// number of pins that belong to the other player that are not part of a mill
		self.otherPlayerNoMillPins = 0;	
		for (var i = 0; i < board.length; i++){
			if (board[i].control === "player2Pin"){
				self.otherPlayerNoPins++;
				if (!self.checkForMills(i)){
					self.otherPlayerNoMillPins++;
				}
				// if (!board[i].isMill){
				// 	otherPlayerNoMillPins++;
				// }
			}
		}
		
		console.log("-- can remove mill pin --");
		console.log(self.otherPlayerNoPins);
		console.log(self.otherPlayerNoMillPins);
	}

	self.updateGameState = function(){
		// check terminating conditions
		if (NineCache.gameObj.p1PinsLeft < 3){
			// Player 2 wins !
			console.log("PLAYER 2 WINS !!!!!!!");
		} else if (NineCache.gameObj.p2PinsLeft < 3){
			// Player 1 wins !
			console.log("PLAYER 1 WINS !!!!!!!");
		}

		if ( (NineCache.gameObj.p1PlacePins < 1) && (NineCache.gameObj.p2PlacePins < 1) ){
			NineCache.gameObj.gameState = "move";
		} else {
			NineCache.gameObj.gameState = 'place';
		}

		if (NineCache.gameObj.p1PinsLeft == 3){
			console.log("!!!!!! player 1 can fly");
		}

		if (NineCache.gameObj.p2PinsLeft == 3){
			console.log("!!!!!! player 2 can fly");
		}
	}

	self.updatePlayerTurn = function(playerid){
		NineCache.gameObj.playerTurn = playerid;
	}

	self.removePin = function(pinIndex, player){
		var pinBtn = NineCache.gameObj.board[pinIndex];
		console.log("1: " + pinIndex);
		console.log(NineCache.gameObj.board);
		console.log(pinBtn);
		if (pinBtn.control === "player2Pin"){
			console.log("2: " + self.otherPlayerNoMillPins, self.checkForMills(pinIndex));
			if ( (self.otherPlayerNoMillPins > 0) && (!self.checkForMills(pinIndex)) ){
				pinBtn.control = "pinFreePlace";
				self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
				self.updateGameState();
				// send data to server
				NineCache.mySocket.emit('removePin', 
					{ gameId: NineCache.gameObj.gameId, 
					  userid: NineCache.userData.id, 
					  pinIndex: pinIndex });
				
				console.log("3");
			}
			
		}
	}

	// player = playerMe
	self.placePin = function(pinBtn, pinBtnInd, player){
		if (pinBtn.control === 'pinFreePlace'){
			console.log("PLACE PIN:");
			console.log(player);

			// place pin
			self.board[pinBtnInd].control = player;
			
			// check for mill detection
			var millData = self.checkForMills(pinBtnInd);

			if (millData){
				console.log("MILL !");
				self.highlightRemovablePins();
			} else {
				self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
			}

			// send data to server
			NineCache.mySocket.emit('placePin', 
				{ gameId: NineCache.gameObj.gameId, 
				  userid: NineCache.userData.id, 
				  pinIndex: pinBtnInd,
				  newMill: millData });
		}
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('placePin', function (data) {
			// {
			// 	"gameId": gameObj.gameId,
			// 	"pinIndex": data.pinIndex,
			// 	"playerTurn": gameObj.playerTurn,
			// 	"gameState": gameObj.gameState
			// }
			if (NineCache.gameObj.gameId == data.gameId){
				NineCache.gameObj.gameState = data.gameState;
				var player = 'player2Pin';
				NineCache.gameObj.board[data.pinIndex].control = player;
				$scope.$apply(function(){
					self.updatePlayerTurn(data.playerTurn);
				});
			}
		});

		NineCache.mySocket.on('removePin', function (data) {
			// {
			// 	"gameId": gameObj.gameId,
			// 	"pinIndex": data.pinIndex,
			// 	"playerTurn": gameObj.playerTurn,
			// 	"gameState": gameObj.gameState
			// }
			console.log("=================================");
			console.log("=================================");
			console.log("=================================");
			console.log(data);
			if (NineCache.gameObj.gameId == data.gameId){
				NineCache.gameObj.gameState = data.gameState;
				var player = 'player2Pin';
				NineCache.gameObj.board[data.pinIndex].control = "pinFreePlace";
				console.log("THIS GUYS TURN: " + data.playerTurn);
				self.updateGameState();
				$scope.$apply(function(){
					self.updatePlayerTurn(data.playerTurn);
				});
			}
		});
	}

	self.initDataStructures = function(){
		//     0    1    2    3    4    5    6
		
		// 0  p0              p1             p2
		
		// 1        p8        p9       p10
		
		// 2             p16  p17  p18              
		
		// 3  p7    p15  p23       p19 p11   p3
		
		// 4             p22  p21  p20  
		
		// 5        p14       p13      p12
		
		// 6  p6              p5             p4

		self.board = 
			[
			  {"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 1 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 9 ], "hNeighbours": [ 0, 2 ],'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 3 ], "hNeighbours": [ 1 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 2, 4 ], "hNeighbours": [ 11 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 3 ], "hNeighbours": [ 5 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 13 ], "hNeighbours": [ 4, 6 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 5 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 0, 6 ], "hNeighbours": [ 15 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 15 ], "hNeighbours": [ 9 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 1, 17 ], "hNeighbours": [ 8, 10 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 11 ], "hNeighbours": [ 9 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 10, 12 ], "hNeighbours": [ 3, 19 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 11 ], "hNeighbours": [ 13 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 5, 21 ], "hNeighbours": [ 12, 14 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 15 ], "hNeighbours": [ 13 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 8, 14 ], "hNeighbours": [ 7, 23 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 23 ], "hNeighbours": [ 17 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 9 ], "hNeighbours": [ 16, 18 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 19 ], "hNeighbours": [ 17 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 18, 20 ], "hNeighbours": [ 11 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 19 ], "hNeighbours": [ 21 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 13 ], "hNeighbours": [ 20, 22 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 23 ], "hNeighbours": [ 21 ], 'isMill': false },
			  {"control": "pinFreePlace", "vNeighbours": [ 16, 22 ], "hNeighbours": [ 15 ], 'isMill': false }
			];

		self.playerColor = 'player1Pin';
		// self.canRemoveMillPin = false;	// 

		NineCache.gameObj.board = self.board;
		// setup game
		// if (self.NineCache.gameObj.playerTurn == self.userData.id){
		// 	$scope.myTurn = true;
		// } else {
		// 	$scope.myTurn = false;
		// }
		$scope.myTurn = (NineCache.gameObj.playerTurn == NineCache.userData.id);
		console.log("IS IT MY TURN ?");
		console.log($scope.myTurn);

	}

	self.init = function(){
		console.log("Game Controller !");
		console.log("--------- my id: " + NineCache.userData.id + "----------------");
		NineCache.gameObj.gameState = "place";	// 'place' or 'move'
		self.NineCache = NineCache;
		console.log("PARAM:");
		console.log($stateParams['game_id']);
		$scope.myTurn = false;
		$scope.displayAll = true;

		self.updatePlayerTurn(NineCache.gameObj.playerTurn);
		self.initDataStructures();
		self.handleSocketRequests();
	}

	self.init();

});
