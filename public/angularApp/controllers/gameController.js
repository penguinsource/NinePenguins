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
		var pinBtn = self.NineCache.gameObj.board[pinIndex];
		// console.log("pin btn: " + pinIndex);
		// console.log(self.NineCache.gameObj.board);
		// console.log(pinBtn);
		if (self.isEven(pinIndex)){
			// console.log("its even !");

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
			if (self.areAllEqual(pinBtn.control, 
								 middlePin.control, 
								 otherPin.control)){
			// if ((pinBtn.control === middlePin.control) 
			// 				&& (middlePin.control === otherPin.control)){
				// console.log("!!!!!!Horizontal Mill, indices: " 
							// + pinIndex, middlePinInd, otherPinInd);
				return {"millType" : 'horizontal', 
						"millIndices": [pinIndex, middlePinInd, otherPinInd]};
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
				// console.log("Vertical Mill, indices: " 
							// + pinIndex, middlePinInd, otherPinInd);
				return { "millType" : 'vertical', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
			}
		} else {
			// console.log("its odd !");
			
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
					// console.log("Horizontal Mill case 1, indices: " 
									// + pinIndex, middlePinInd, otherPinInd);
					return { "millType" : 'horizontal', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			} else { // case 2, pinBtn has 2 horizontal neighbours
				var nPinOneInd = pinBtn.hNeighbours[0];
				var nPinTwoInd = pinBtn.hNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) 
							&& (pinBtn.control === neighbourPinTwo.control) ){
					// console.log("Horizontal Mill case 2, indices: " 
							// + pinIndex, nPinOneInd, nPinTwoInd);
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
					// console.log("Vertical Mill case 1, indices: " + pinIndex, middlePinInd, otherPinInd);
					return { "millType" : 'vertical', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			} else { // case 2, pinBtn has 2 vertical neighbours
				var nPinOneInd = pinBtn.vNeighbours[0];
				var nPinTwoInd = pinBtn.vNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) && (pinBtn.control === neighbourPinTwo.control) ){
					// console.log("Vertical Mill case 2, indices: " + pinIndex, nPinOneInd, nPinTwoInd);
					return { "millType" : 'vertical', "millIndices": [pinIndex, middlePinInd, otherPinInd] };
				}
			}

		}
		return false;
	}

	self.clickEvent = function(pinBtn, pinIndex){
		var pinBtn = NineCache.gameObj.board[pinIndex];
		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}
		
		// console.log("click event, pinIndex " + pinIndex);
		// console.log(pinBtn);
		// console.log("Current GAME STATE:" + NineCache.gameObj.gameState, pinIndex);
		if (NineCache.gameObj.gameState === 'place'){
			self.placePin(pinIndex, self.playerLink);
		} else if (NineCache.gameObj.gameState === 'remove'){
			// self.selectedPin = pinBtn;
			// console.log("removing pin with index: " + pinIndex);
			self.removePin(pinIndex, self.playerLink);
		} else if (NineCache.gameObj.gameState === 'move'){

		}
	}

	self.placePin = function(targetIndex, playerLink){
		// console.log("__pin index: " + targetIndex);
		// console.log(">>pin index: " + playerLink);

		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}

		// check if target pin index is available
		if (!(self.NineCache.gameObj.board[targetIndex].control == "pinFreePlace")){
			console.log("ERROR! Target pin index" + targetIndex + 
						" is not available. It belongs to a player.");
			return;
		}
		
		// check if i have enough pins left to place
		var placePins = (NineCache.userData.id == NineCache.gameObj.p1id) ?
							NineCache.gameObj.p1PlacePins :
							NineCache.gameObj.p2PlacePins;
		if (placePins < 1){
			console.log("ERROR! You don't have any pins left to place.");
		}

		// place pin
		self.board[targetIndex].control = playerLink;
		if (NineCache.userData.id == NineCache.gameObj.p1id){
			NineCache.gameObj.p1PlacePins--;
		} else {
			NineCache.gameObj.p2PlacePins--;
		}
		console.log("after:");
		console.log(NineCache.gameObj);
		
		// check for mill detection
		var millData = self.checkForMills(targetIndex);
		// console.log("mill data:");
		// console.log(millData);

		if (millData){
			// keep my turn
			// change my gameState to 'remove'
			if (NineCache.userData.id == NineCache.gameObj.p1id){
				NineCache.gameObj.p1state = "remove";
			} else {
				NineCache.gameObj.p2state = "remove";
			}
			self.highlightRemovablePins();
			// if (self.playerLink == playerLink){	// DEPRECATED !
				// send update to server ***
				NineCache.mySocket.emit('placePin', 
					{ userid: NineCache.userData.id,
					  gameId: NineCache.gameObj.gameId,  
					  pinIndex: targetIndex,
					  newMill: millData });
			// }			
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} else {
				// if player has 0 pins left to place, set their state to 'move'
				if (NineCache.userData.id == NineCache.gameObj.p1id){
					if (NineCache.gameObj.p1PlacePins == 0){
						NineCache.gameObj.p1state = "move";
					}
				} else {
					if (NineCache.gameObj.p2PlacePins == 0){
						NineCache.gameObj.p2state = "move";
					}
				}
				// change player turn (to the other player) ***
				var otherPlayerId = 
					(NineCache.userData.id == NineCache.gameObj.p1id) ?
					NineCache.gameObj.p2id : NineCache.gameObj.p1id;
				NineCache.gameObj.playerTurn = otherPlayerId;

				// send data to server
				NineCache.mySocket.emit('placePin', 
					{ userid: NineCache.userData.id,
					  gameId: NineCache.gameObj.gameId,  
					  pinIndex: targetIndex,
					  newMill: millData });
			}
			self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
		}
	}

	self.movePin = function(sourceIndex, targetIndex, playerLink){
		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}

		// check if target pin index is available
		if (!(self.NineCache.gameObj.board[targetIndex].control == "pinFreePlace")){
			console.log("ERROR! Target pin index" + targetIndex + 
						" is not available. It belongs to a player.");
			return;
		}

		// check if the pin being dragged belongs to me and not the other player 
		console.log("moving pin, start index: "  + self.movingPinStartIndex);
		if (!self.pinBelongsToPlayer(sourceIndex, playerLink)){
			console.log("ERROR! Pin dropped doesn't belong to you");
			return;
		}

		// check if it's a valid move 
		//(aka check if targetIndex is a neighbour of sourceIndex)
		if (!(self.indicesAreNeighbours(sourceIndex, targetIndex))){
			console.log("ERROR! Invalid move, target index " + targetIndex + 
						" is not aa neighbour of source index " + sourceIndex);
			return;
		}

		// move pin
		$scope.$apply(function(){
			self.NineCache.gameObj.board[sourceIndex].control = "pinFreePlace";
			self.NineCache.gameObj.board[targetIndex].control = playerLink;
		});

		console.log("check for mills ::: " + targetIndex);
		console.log(self.checkForMills(targetIndex));

		// send update to server


		// if playerLink is me, then send update to server
		// if playerLink is not me, then do nothing as this is a server update
		// if (self.playerLink == playerLink){
			// send update to server
		// }

		// check game winning conditions and update gui (if anything)
		self.checkGameConditions();
	}

	// removeAction is a boolean that is null by default
	self.checkGameConditions = function(removeAction){
		console.log("Checking game conditions");
		if (removeAction){
			// get the # of overall pins that the other player has
			var otherPlayerPins = 
				(NineCache.userData.id == NineCache.gameObj.p1id) ?
				NineCache.gameObj.p2PinsLeft :
				NineCache.gameObj.p1PinsLeft;
			if (otherPlayerPins < 3){
				// current player wins game
				console.log("You Won Game. #1");
			}
			// check if the other player can move any pin..
			var otherPlayerState = 
				(NineCache.userData.id == NineCache.gameObj.p1id) ?
				NineCache.gameObj.p2state : NineCache.gameObj.p1state;
			if ( (otherPlayerState == "place") || 
				 (otherPlayerState == "fly") ){
				return true;
			} else if (otherPlayerState == "move"){

			}

		}


		// ************** unimplemented yet..
	}

	// Array.prototype.contains = function(k) {
	// 	for(var i=0; i < this.length; i++){
	// 		if(this[i] === k){
	// 		  return true;
	// 		}
	// 	}
	// 	return false;
	// }

	self.indicesAreNeighbours = function(index1, index2){
		console.log("index1: " + index1);
		console.log("index2: " + index2);
		var indexObj = self.NineCache.gameObj.board[index1];

		for (var i = 0; i < indexObj.vNeighbours.length; i++){
			if (indexObj.vNeighbours[i] == index2){
				return true;
			}
		}
		for (var i = 0; i < indexObj.hNeighbours.length; i++){
			if (indexObj.hNeighbours[i] == index2){
				return true;
			}
		}
		return false;
	}

	self.pinBelongsToPlayer = function(pinIndex, playerLink){
		return self.NineCache.gameObj.board[pinIndex].control == playerLink;
	}

	// DEPRECATED
	// self.onDragStart = function(evt){
	// 	console.log("ondragstart !!");
	// 	console.log(evt);
	// 	// console.log("DATA PIN INDEX IS : ");
	// 	// console.log(evt.attributes["data-pinIndex"].value);
	// }

	$scope.blah = function(){
		console.log("THIS IS BLAH !!!!!!!>>>>>>>>>>>>>>");
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
		
		// console.log("-- can remove mill pin --");
		// console.log(self.otherPlayerNoPins);
		// console.log(self.otherPlayerNoMillPins);
	}

	self.updateGameState = function(){
		// check terminating conditions
		if (NineCache.gameObj.p1PinsLeft < 3){
			// Player 2 wins !
			// console.log("PLAYER 2 WINS !!!!!!!");
		} else if (NineCache.gameObj.p2PinsLeft < 3){
			// Player 1 wins !
			// console.log("PLAYER 1 WINS !!!!!!!");
		}

		if ( (NineCache.gameObj.p1PlacePins < 1) && (NineCache.gameObj.p2PlacePins < 1) ){
			NineCache.gameObj.gameState = "move";
		} else {
			NineCache.gameObj.gameState = 'place';
		}

		if (NineCache.gameObj.p1PinsLeft == 3){
			// console.log("!!!!!! player 1 can fly");
		}

		if (NineCache.gameObj.p2PinsLeft == 3){
			// console.log("!!!!!! player 2 can fly");
		}
	}

	self.updatePlayerTurn = function(playerid){
		NineCache.gameObj.playerTurn = playerid;
	}

	self.removePin = function(pinIndex, player){
		var pinBtn = NineCache.gameObj.board[pinIndex];
		// console.log("1: " + pinIndex);
		// console.log(NineCache.gameObj.board);
		// console.log(pinBtn);
		if (pinBtn.control === "player2Pin"){
			// console.log("2: " + self.otherPlayerNoMillPins, self.checkForMills(pinIndex));
			if ( (self.otherPlayerNoMillPins > 0) && (!self.checkForMills(pinIndex)) ){
				pinBtn.control = "pinFreePlace";
				self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
				self.updateGameState();
				// send data to server
				NineCache.mySocket.emit('removePin', 
					{ gameId: NineCache.gameObj.gameId, 
					  userid: NineCache.userData.id, 
					  pinIndex: pinIndex });
				
				// console.log("3");
			}
			
		}
	}

	// returns true if pin index is not occupied
	self.isPinIndexFree = function(pinIndex){
		if (self.board[pinIndex].control == "pinFreePlace"){
			return true;
		} else {
			return false;
		}
	}


	// player = 'player1Pin' or 'player2Pin' (pin belongs to this player)
	// pinBtnInd = 0 or 1 or .. etc (index where the pin should be placed)
	// there are 3 types of action: 'place' or 'move' or ''fly
	//	 if action is 'place' 
	//						  => 'pinIndex' is the target pin index
	//					      => 'sourcePinIndex' is not defined
	//   if action is 'move' or 'fly' 
	//						  => pinIndex is target pin index
	//						  =>and sourcePinIndex is the source pin index
	self.canPlacePin = function(pinIndex, player, sourcePinIndex){
		// check to see if its 'player's turn to place a pin and if the target
		// pin index is available
		if ( (player == "player1Pin") && (!self.isMyTurn()) ){
			console.log("IT IS NOT MY TURN TO PLACE A PIN !!!!!!!");
			return false;
		}

		if (self.board[pinIndex].control != "pinFreePlace"){
			console.log("ERROR! can't place pin at pinindex " + pinIndex +
						" as it's occupied !");
			return false;
		}

		// if this is set, then this is either a 'move' or a 'fly' action
		// so now I have to remove the control from the source pin index
		// also, check that curr user has a pin placed at 'sourcePinIndex'
		if (sourcePinIndex){
			if (! (self.board[sourcePinIndex].control == player)) {
				console.log("ERROR ! source pin index doesnt belong to me !!");
				return false;
			}
			
		}

		return true;

	}

	self.haha = function(){
		console.log("REAAAAAAAAAAAAAALY");
	}

	// used for dragging pin from a position to another
	// type = {drag}
	// Some global variables will be set by this function in order to keep track
	// of the user picking up a pin/dragging a pin over other pin indices and
	// dropping a pin:
	// dragStartIndex -> IF SET, this is the pin that has been picked up by user
	$scope.setPinAction = function(actionType, pinIndex){
		switch(actionType){
			case "dragstart":
				console.log("type is " + actionType);
				// self.pinMoveState = "";
				break;
			case "dragover":
				if (self.isMyTurn()){
					console.log(NineCache.gameObj.board[pinIndex].control);
					// $scope.$apply(function(){
						// NineCache.gameObj.board[pinIndex].control = "player1Pin";
					// });
					
					
				}
				break;
		}
		console.log("type is " + actionType);
		// $scope.pinMoveState = "dragstarted";
		// $scope.pinMoveState = moveState;
		// if (type == "dragstart"){
			// $scope.dragPinStartIndex = 
		// }
	}

	self.isMyTurn = function(){
		// if (NineCache.userData.id == NineCache.gameObj.playerTurn){
		// 	return true;
		// } else {
		// 	return false;
		// }
		return (NineCache.gameObj.playerTurn == NineCache.userData.id);
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

		// self.playerColor = 'player1Pin';
		self.playerLink = "player1Pin";
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
		console.log(self.isMyTurn());

	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('placePin', function (data) {
			if (NineCache.gameObj.gameId == data.gameId){
				// NineCache.gameObj.gameState = data.gameState;
				var player = 'player2Pin';
				NineCache.gameObj.board[data.pinIndex].control = player;
				$scope.$apply(function(){
					self.updatePlayerTurn(data.playerTurn);
				});
			} else {
				console.log("ERROR ! Received data about wrong game obj"+
							" from the server.");
			}
		});
					// "gameId": gameObj.gameId,
					// "playerid": playerId,
					// "pinIndex": data.pinIndex,
					// "playerTurn": gameObj.playerTurn,
					// "playerState": currPlayerState

		NineCache.mySocket.on('removePin', function (data) {
			// {
			// 	"gameId": gameObj.gameId,
			// 	"pinIndex": data.pinIndex,
			// 	"playerTurn": gameObj.playerTurn,
			// 	"gameState": gameObj.gameState
			// }

			// console.log("=================================");
			// console.log("=================================");
			// console.log("=================================");
			// console.log(data);
			if (NineCache.gameObj.gameId == data.gameId){
				NineCache.gameObj.gameState = data.gameState;
				var player = 'player2Pin';
				NineCache.gameObj.board[data.pinIndex].control = "pinFreePlace";
				// console.log("THIS GUYS TURN: " + data.playerTurn);
				self.updateGameState();
				$scope.$apply(function(){
					self.updatePlayerTurn(data.playerTurn);
				});
			}
		});
	}

	self.init = function(){
		// console.log("Game Controller !");
		// NineCache.gameObj.gameState = "place";	// 'place' or 'move'
		self.NineCache = NineCache;
		// console.log("PARAM:");
		// console.log($stateParams['game_id']);
		$scope.myTurn = false;
		$scope.displayAll = true;

		self.updatePlayerTurn(NineCache.gameObj.playerTurn);
		self.initDataStructures();
		self.handleSocketRequests();
		console.log("my game obj:");
		console.log(NineCache.gameObj);
	}

	self.init();

});
