var nineApp = angular.module("nineApp");

nineApp.controller('gameController', 
							function($scope, $http, $stateParams, NineCache){
	var self = this;

	// Helper Functions
	self.isEven = function(n) {
	  return n === parseFloat(n)? !(n%2) : void 0;
	}

	self.areAllEqual = function(one, two, three){
		if ( (one == two) && (two == three) ){
			return true;
		} else {
			return false;
		}
	}

	self.checkForMills = function(pinBtn, pinBtnInd){
		if (self.isEven(pinBtnInd)){
			console.log("its even !");

			// get the 2 horizontal pins connected to pinBtn
			var middlePinInd = pinBtn.hNeighbours[0];
			var middlePin = self.board[middlePinInd];
			var otherPin = {};
			var otherPinInd = -1;
			for (var i = 0; i < middlePin.hNeighbours.length; i++){
				if (middlePin.hNeighbours[i] != pinBtnInd){
					otherPinInd = middlePin.hNeighbours[i];
					otherPin = self.board[otherPinInd];
				}
			}

			// check for horizontal mill
			
			if (self.areAllEqual(pinBtn.control, middlePin.control, otherPin.control)){
			// if ((pinBtn.control === middlePin.control) 
			// 				&& (middlePin.control === otherPin.control)){
				console.log("!!!!!!Horizontal Mill, indices: " 
							+ pinBtnInd, middlePinInd, otherPinInd);
			}
			// console.log("my pin index is: " + pinBtnInd);
			// console.log("middle pin index is: " + middlePinInd);
			// console.log("other pin index is: " + otherPinInd);

			// get the 2 vertical pins connected to pinBtn
			middlePinInd = pinBtn.vNeighbours[0];
			middlePin = self.board[middlePinInd];
			for (var i = 0; i < middlePin.vNeighbours.length; i++){
				if (middlePin.vNeighbours[i] != pinBtnInd){
					otherPinInd = middlePin.vNeighbours[i];
					otherPin = self.board[otherPinInd];
				}
			}

			// check for vertical mill
			if ((pinBtn.control === middlePin.control) 
							&& (middlePin.control === otherPin.control)){
				console.log("Vertical Mill, indices: " 
							+ pinBtnInd, middlePinInd, otherPinInd);
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
					if (middlePin.hNeighbours[i] != pinBtnInd){
						otherPinInd = middlePin.hNeighbours[i];
						otherPin = self.board[otherPinInd];
					}
				}

				if ( (pinBtn.control === middlePin.control) 
								&& (middlePin.control === otherPin.control) ){
					console.log("Horizontal Mill case 1, indices: " 
									+ pinBtnInd, middlePinInd, otherPinInd);
				}
			} else { // case 2, pinBtn has 2 horizontal neighbours
				var nPinOneInd = pinBtn.hNeighbours[0];
				var nPinTwoInd = pinBtn.hNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) 
							&& (pinBtn.control === neighbourPinTwo.control) ){
					console.log("Horizontal Mill case 2, indices: " 
							+ pinBtnInd, nPinOneInd, nPinTwoInd);
				}
			}
			
			// check for vertical mill
			// case 1, pinBtn only has 1 vertical neighbour
			if (pinBtn.vNeighbours.length == 1){
				middlePinInd = pinBtn.vNeighbours[0];
				var middlePin = self.board[middlePinInd];
				for (var i = 0; i < middlePin.vNeighbours.length; i++){
					if (middlePin.vNeighbours[i] != pinBtnInd){
						otherPinInd = middlePin.vNeighbours[i];
						otherPin = self.board[otherPinInd];
					}
				}

				if ( (pinBtn.control === middlePin.control) && (middlePin.control === otherPin.control) ){
					console.log("Vertical Mill case 1, indices: " + pinBtnInd, middlePinInd, otherPinInd);
				}
			} else { // case 2, pinBtn has 2 vertical neighbours
				var nPinOneInd = pinBtn.vNeighbours[0];
				var nPinTwoInd = pinBtn.vNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) && (pinBtn.control === neighbourPinTwo.control) ){
					console.log("Vertical Mill case 2, indices: " + pinBtnInd, nPinOneInd, nPinTwoInd);
				}
			}

		}
	}

	self.clickEvent = function(pinBtn, pinBtnInd){
		console.log("click event, pinBtnInd " + pinBtnInd);
		console.log(pinBtn);
		if (self.currentGameState === 'place'){
			self.placePin(pinBtn, pinBtnInd, self.playerColor);
		} else if (self.currentGameState === 'move'){

		}		
	}

	// player = playerMe
	self.placePin = function(pinBtn, pinBtnInd, player){
		if (pinBtn.control === 'pinFreePlace'){
			console.log("PLACE PIN:");
			console.log(player);

			// place pin
			self.board[pinBtnInd].control = player;
			NineCache.mySocket.emit('placePin', 
				{ gameId: NineCache.gameObj.gameId, 
				  userid: NineCache.userData.id, 
				  pinIndex: pinBtnInd });

			// mill detected
			if (self.checkForMills(pinBtn, pinBtnInd)){
				console.log("MILL !");
			} else {
				self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
				console.log("NO MILL!");

			}
		}
	}

	self.updatePlayerTurn = function(playerid){
		NineCache.gameObj.playerTurn = playerid;
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('placePin', function (data) {
			// {
			// 	"gameId": gameObj.gameId,
			// 	"playerid": gameObj.p2id,
			// 	"pinIndex": data.pinIndex,
			// 	"playerTurn": gameObj.playerTurn,
			// 	"gameState": gameObj.gameState
			// }
			if (NineCache.gameObj.gameId == data.gameId){
				NineCache.gameObj.gameState = data.gameState;
				var player = 'player2pin';
				NineCache.gameObj.board[data.pinIndex].control = player;
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

		self.board = [{"control": "pinFreePlace", "vNeighbours": [ 7 ], "hNeighbours": [ 1 ] },
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
					  {"control": "pinFreePlace", "vNeighbours": [ 16, 22 ], "hNeighbours": [ 15 ] }];

		self.playerColor = 'player1pin';

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
		self.currentGameState = "place";	// 'place' or 'move'
		self.NineCache = NineCache;
		console.log("PARAM:");
		console.log($stateParams['game_id']);
		$scope.myTurn = false;

		self.updatePlayerTurn(NineCache.gameObj.playerTurn);
		self.initDataStructures();
		self.handleSocketRequests();
	}

	self.init();
});
