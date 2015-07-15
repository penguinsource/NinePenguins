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
		if (self.isEven(pinIndex)){
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
				return {"millType" : 'horizontal',
						"millIndices": [pinIndex, middlePinInd, otherPinInd]};
			}

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
				var retData =
					{"millType" : 'vertical',
					 "millIndices": [pinIndex, middlePinInd, otherPinInd]};
				return retData;
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
					var retData =
						{"millType" : 'horizontal',
						 "millIndices": [pinIndex, middlePinInd, otherPinInd] };
					return retData;
				}
			} else { // case 2, pinBtn has 2 horizontal neighbours
				var nPinOneInd = pinBtn.hNeighbours[0];
				var nPinTwoInd = pinBtn.hNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control)
							&& (pinBtn.control === neighbourPinTwo.control) ){
					var retData =
						{"millType" : 'horizontal',
						 "millIndices": [pinIndex, middlePinInd, otherPinInd]};
					return retData;
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

				if ( (pinBtn.control === middlePin.control) &&
					 (middlePin.control === otherPin.control) ){
					// console.log("Vertical Mill case 1, indices: "
					// + pinIndex, middlePinInd, otherPinInd);
					var retData =
						{"millType" : 'vertical',
						 "millIndices": [pinIndex, middlePinInd, otherPinInd]};
					return retData;
				}
			} else { // case 2, pinBtn has 2 vertical neighbours
				var nPinOneInd = pinBtn.vNeighbours[0];
				var nPinTwoInd = pinBtn.vNeighbours[1];
				var neighbourPinOne = self.board[nPinOneInd];
				var neighbourPinTwo = self.board[nPinTwoInd];
				if ( (pinBtn.control === neighbourPinOne.control) &&
					 (pinBtn.control === neighbourPinTwo.control) ){
					var retData =
						{"millType" : 'vertical',
						 "millIndices": [pinIndex, middlePinInd, otherPinInd]};

					return retData;
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
			// return;
		}
		var myPlayerObj = NineCache.getMyPlayerObject();
		switch(myPlayerObj.pState){
			case "place":
				self.placePin(pinIndex, self.playerLink);
				break;
			case "remove":
				self.removePin(pinIndex, self.playerLink);
				break;
			// case "move": // ************* to be implemented in the future

			default:
				console.log("default code block called for some reason");
				console.log(myPlayerObj.pState);
				console.log(pinIndex);
				break;
		}
	}

	self.placePin = function(targetIndex, playerLink){
		var myPlayerObj = NineCache.getMyPlayerObject();
		var otherPlayerObj = NineCache.getOtherPlayerObject();
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
		if (myPlayerObj.pPlacePins < 1){
			console.log("ERROR! You don't have any pins left to place.");
		}

		// place pin
		self.board[targetIndex].control = playerLink;
		myPlayerObj.pPlacePins--;
		console.log("place pin player obj:");
		console.log(myPlayerObj);
		console.log(NineCache.gameObj);
		// console.log("after:");
		// console.log(NineCache.gameObj);

		// check for mill detection
		var millData = self.checkForMills(targetIndex);
		// console.log("mill data:");
		// console.log(millData);

		if (millData){
			// keep my turn
			// change my gameState to 'remove'
			myPlayerObj.pState = "remove";
			self.highlightRemovablePins();
			// console.log("new Mill ! game Obj:");
			// console.log(NineCache.gameObj);
			// if (self.playerLink == playerLink){	// DEPRECATED !
				// send update to server ***
				NineCache.mySocket.emit('placePin',
					{ userid: NineCache.userData.id,
					  gameId: NineCache.gameObj.gameId,
					  pinIndex: targetIndex,
					  newMill: millData });
				return;
			// }
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} else {
				// if player has 0 pins left to place, set their state to 'move'
				if (myPlayerObj.pPlacePins == 0){
					myPlayerObj.pState = "move";
				}
				// change player turn to the other player
				NineCache.gameObj.playerTurn = otherPlayerObj.pid;

				// send data to server
				NineCache.mySocket.emit('placePin',
					{ userid: NineCache.userData.id,
					  gameId: NineCache.gameObj.gameId,
					  pinIndex: targetIndex,
					  newMill: null });
				return;
			}
			// self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
		}
	}

	self.indicesAreNeighbours = function(index1, index2){
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

	self.movePin = function(sourceIndex, targetIndex){
		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}

		var myPlayerObj = NineCache.getMyPlayerObject();
		var otherPlayerObj = NineCache.getOtherPlayerObject();

		// DEPRECATED **
		// if (myPlayerObj.pState != "move"){
		// 	console.log("ERROR ! Your state is not move");
		// 	return;
		// }

		// check if target pin index is available
		if (!(self.NineCache.gameObj.board[targetIndex].control == "pinFreePlace")){
			console.log("ERROR! Target pin index" + targetIndex +
						" is not available. It belongs to a player.");
			return;
		}

		// check if the pin being dragged belongs to me and not the other player
		if (!self.pinBelongsToPlayer(sourceIndex, self.playerLink)){
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
			self.NineCache.gameObj.board[targetIndex].control = self.playerLink;
		});

		var millData = self.checkForMills(targetIndex);
		if (millData){
			// change my state, keep my turn
			myPlayerObj.pState = "remove";
			console.log("MILL FORMED !!!!!");
			// send data to server
			NineCache.mySocket.emit('movePin',
				{ userid: NineCache.userData.id,
				  gameId: NineCache.gameObj.gameId,
				  sourceIndex: sourceIndex,
				  targetIndex: targetIndex,
				  newMill: millData });
			return;
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} else {
				// change player turn to the other player
				NineCache.gameObj.playerTurn = otherPlayerObj.pid;

				// send data to server
				NineCache.mySocket.emit('movePin',
					{ userid: NineCache.userData.id,
					  gameId: NineCache.gameObj.gameId,
				  	  sourceIndex: sourceIndex,
				  	  targetIndex: targetIndex,
					  newMill: null });
				return;
			}
		}

	}

	self.flyPin = function(sourceIndex, targetIndex){
		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}

		var myPlayerObj = NineCache.getMyPlayerObject();
		var otherPlayerObj = NineCache.getOtherPlayerObject();
		var gameObj = self.NineCache.gameObj;

		// check if target pin index is available
		if (!(gameObj.board[targetIndex].control == "pinFreePlace")){
			console.log("ERROR! Target pin index" + targetIndex +
						" is not available. It belongs to a player.");
			return;
		}

		// check if the pin being dragged belongs to me and not the other player
		if (!self.pinBelongsToPlayer(sourceIndex, self.playerLink)){
			console.log("ERROR! Pin dropped doesn't belong to you");
			return;
		}

		// fly(move) pin
		$scope.$apply(function(){
			self.NineCache.gameObj.board[sourceIndex].control = "pinFreePlace";
			self.NineCache.gameObj.board[targetIndex].control = self.playerLink;
		});

		var millData = self.checkForMills(targetIndex);
		if (millData){
			// change my state, keep my turn
			myPlayerObj.pState = "remove";
			console.log("MILL FORMED !!!!!");
			// send data to server
			NineCache.mySocket.emit('flyPin',
				{ userid: NineCache.userData.id,
				  gameId: NineCache.gameObj.gameId,
				  sourceIndex: sourceIndex,
				  targetIndex: targetIndex,
				  newMill: millData });
			return;
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} else {
				// change player turn to the other player
				NineCache.gameObj.playerTurn = otherPlayerObj.pid;

				// send data to server
				NineCache.mySocket.emit('flyPin',
					{ userid: NineCache.userData.id,
					  gameId: NineCache.gameObj.gameId,
				  	  sourceIndex: sourceIndex,
				  	  targetIndex: targetIndex,
					  newMill: null });
				return;
			}
		}

	}

	// removeAction is a boolean that is null by default
	// this returns true if the game has been won by me (myPlayerObject)
	self.checkGameConditions = function(removeAction){
		console.log("Checking game conditions");
		var otherPlayerObj = NineCache.getOtherPlayerObject();
		if (removeAction){
			// if the other player has less than 3 pins..
			if (otherPlayerObj.pPinsLeft < 3){
				// current player wins game
				console.log("Check Game Conditions: You Won Game. #1");
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
			for (var i = 0; i < NineCache.gameObj.board.length; i++){
				var tempPin = NineCache.gameObj.board[i];
				if (tempPin.control == self.otherPlayerBoardName){
					// now check if pin has any free neighbours
					for (var k = 0; k < tempPin.vNeighbours.length; k++){
						var t2Pin = tempPin.vNeighbours[k].control;
						// console.log("do i get here");
						if (t2Pin.control == self.freePinBoardName){
							// console.log("_+_+_+_+_+_+_ hello 1");
							return false;	// game not won
						}
					}
				}
			}
			// console.log("_+_+_+_+_+_+_ hello 2");
			return true;	// game won
		}
	}

	// Array.prototype.contains = function(k) {
	// 	for(var i=0; i < this.length; i++){
	// 		if(this[i] === k){
	// 		  return true;
	// 		}
	// 	}
	// 	return false;
	// }

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

	self.canRemovePin = function(pinIndex){
		// console.log("can remove pin: " + pinIndex);
		// if the pin is not in a mill, it can be removed
		if (!self.checkForMills(pinIndex)){
			// console.log("canRemovePin: pin not in a mill, can be removed !");
			return true;
		} else {
			// ************* to be continued when getting to this point..
			// get the player board name of the pin at pinIndex
			var tempBoardName = NineCache.gameObj.board[pinIndex].control;
			var pinsInMills = [];

			var freePins = 0;
			// check if there are any pins that are not in mills
			// if there are any, then this pin is not removeable
			for (var i = 0; i < NineCache.gameObj.board.length; i++){
				var tempPin = NineCache.gameObj.board[i];
				if ( (i != pinIndex) && (tempPin.control == tempBoardName) ){
					// console.log("checking pin index for mills: " + pinIndex);
					var millCheck = self.checkForMills(i);
					// console.log("MILL check:");
					// console.log(millCheck);
					if (!millCheck){
						// console.log("NO NO NO NO NO **************************************");
						return false;
					}
				}
			}
			// console.log("all in mills.");
			return true;
		}
	}

	self.updatePlayerState = function(playerObj){
		console.log("player obj is");
		console.log(playerObj);
		if (playerObj.pPlacePins > 0){
			console.log("its place !!");
			return "place";
		} else if (playerObj.pPinsLeft > 3){
			console.log("its move !!");
			return "move";
		} else if (playerObj.pPinsLeft == 3){
			console.log("its fly !!");
			return "fly";
		} else {
			console.log("its same !!");
			return playerObj.pState;	// ********* add the case below
		} 
		// ********** explore checking state here and reconsider using check game conditions removeAction boolean ***********
		  // else if (playerObj.pPinsLeft < 3){
		  // 	playerObj.pState = "dead";
		  // }
	}

	self.removePin = function(pinIndex, player){
		var pinBtn = NineCache.gameObj.board[pinIndex];
		// console.log("1: " + pinIndex);
		// console.log(NineCache.gameObj.board);
		// console.log(pinBtn);
		// check that the target pin index belongs to the other player
		if (NineCache.gameObj.board[pinIndex].control != self.otherPlayerBoardName){
			console.log("ERROR! Can't remove pin that doesn't belong to "+
						"the other player");
			return;
		}

		// check if pin at pinIndex can be removed
		if (!self.canRemovePin(pinIndex)){
			console.log("ERROR 2! Can't remove pin");
			return;
		}

		// console.log("before:");
		// console.log(NineCache.gameObj);

		// remove player control from pinIndex
		NineCache.gameObj.board[pinIndex].control = self.freePinBoardName;
		// decrease the other player's pins left
		var otherPlayerObj = NineCache.getOtherPlayerObject();
		otherPlayerObj.pPinsLeft--;

		var myPlayerObj = NineCache.getMyPlayerObject();
		// myPlayerObj.pState = self.updatePlayerState(myPlayerObj);
		otherPlayerObj.pState = self.updatePlayerState(otherPlayerObj);

		var gameConditions = self.checkGameConditions();
		if (gameConditions){
			// game WON
			// console.log("I WON THE GAME !");
		} else {
			// changing player turn
			NineCache.gameObj.playerTurn = otherPlayerObj.pid;
		}
			NineCache.mySocket.emit('removePin',
				{ gameId: NineCache.gameObj.gameId,
				  userid: NineCache.userData.id,
				  pinIndex: pinIndex });
	}

		// if (pinBtn.control === self.otherPlayerBoardName){
		// 	// console.log("2: " + self.otherPlayerNoMillPins, self.checkForMills(pinIndex));
		// 	if ( (self.otherPlayerNoMillPins > 0) && (!self.checkForMills(pinIndex)) ){
		// 		pinBtn.control = "pinFreePlace";
		// 		self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
		// 		self.updateGameState();
		// 		// send data to server
		// 		NineCache.mySocket.emit('removePin',
		// 			{ gameId: NineCache.gameObj.gameId,
		// 			  userid: NineCache.userData.id,
		// 			  pinIndex: pinIndex });

		// 		// console.log("3");
		// 	}

		// }

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
			console.log("ERROR! IT IS NOT MY TURN TO PLACE A PIN !!!!!!!");
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

	// used for dragging pin from a position to another
	// type = {drag}
	// Some global variables will be set by this function in order to keep track
	// of the user picking up a pin/dragging a pin over other pin indices and
	// dropping a pin:
	// dragStartIndex -> IF SET, this is the pin that has been picked up by user
	$scope.setPinAction = function(actionType, pinIndex){
		switch(actionType){
			case "dragstart":
				// console.log("type is " + actionType);
				// self.pinMoveState = "";
				break;
			case "dragover":
				if (self.isMyTurn()){
					// console.log(NineCache.gameObj.board[pinIndex].control);
					// $scope.$apply(function(){
						// NineCache.gameObj.board[pinIndex].control = "player1Pin";
					// });


				}
				break;
		}
		// console.log("type is " + actionType);
		// $scope.pinMoveState = "dragstarted";
		// $scope.pinMoveState = moveState;
		// if (type == "dragstart"){
			// $scope.dragPinStartIndex =
		// }
	}

	self.isMyTurn = function(){
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
		self.otherPlayerBoardName = "player2Pin";
		self.freePinBoardName = "pinFreePlace";
		// self.canRemoveMillPin = false;	//

		NineCache.gameObj.board = self.board;
		// console.log("IS IT MY TURN ?");
		// console.log(self.isMyTurn());
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('placePin', function (data) {
			if (NineCache.gameObj.gameId == data.gameId){
				console.log("place data received:");
				console.log(data);
				var otherPlayerObj = NineCache.getOtherPlayerObject();
				// console.log("my userid: " + NineCache.userData.id);
				var otherPLink = 'player2Pin';
				NineCache.gameObj.board[data.pinIndex].control = 
													self.otherPlayerBoardName;
				otherPlayerObj.pPlacePins--;
				$scope.$apply(function(){
					self.updatePlayerTurn(data.playerTurn);
				});
			} else {
				console.log("ERROR ! Received data about wrong game obj"+
							" from the server.");
			}
		});

		NineCache.mySocket.on('movePin', function (data) {
			if (NineCache.gameObj.gameId == data.gameId){
				console.log("move pin data received:");
				console.log(data);

				// console.log("my userid: " + NineCache.userData.id);
				var otherPLink = 'player2Pin';
				NineCache.gameObj.board[data.sourceIndex].control = 
													self.freePinBoardName;
				NineCache.gameObj.board[data.targetIndex].control = 
													self.otherPlayerBoardName;

				var myPlayerObj = NineCache.getMyPlayerObject();
				var otherPlayerObj = NineCache.getMyPlayerObject();
				myPlayerObj.pState = 
								self.updatePlayerState(myPlayerObj);
				otherPlayerObj.pState = 
								self.updatePlayerState(otherPlayerObj);

				if (!data.newMill){
					$scope.$apply(function(){
						NineCache.gameObj.playerTurn = NineCache.userData.id;
					});
				}

			} else {
				console.log("ERROR ! Received data about wrong game obj"+
							" from the server.");
			}
		});

		NineCache.mySocket.on("flyPin", function(data){
			console.log("+_+_+_+_+_+_+fly pin data received:");
			console.log(data);
			if (NineCache.gameObj.gameId == data.gameId){
				NineCache.gameObj.board[data.sourceIndex].control = 
													self.freePinBoardName;
				NineCache.gameObj.board[data.targetIndex].control = 
													self.otherPlayerBoardName;
				if (!data.newMill){
					$scope.$apply(function(){
						NineCache.gameObj.playerTurn = NineCache.userData.id;
					});
				}
			}
		});

		NineCache.mySocket.on('removePin', function (data) {
			console.log("remove pin data received:");
			console.log(data);
			if (NineCache.gameObj.gameId == data.gameId){
				// NineCache.gameObj.gameState = data.gameState;
				var player = 'player2Pin';
				NineCache.gameObj.board[data.pinIndex].control = "pinFreePlace";
				var myPlayerObj = NineCache.getMyPlayerObject();
				myPlayerObj.pPinsLeft--;

				var otherPlayerObj = NineCache.getMyPlayerObject();
				myPlayerObj.pState = 
								self.updatePlayerState(myPlayerObj);
				otherPlayerObj.pState = 
								self.updatePlayerState(otherPlayerObj);

				// self.updateGameState();
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
		$scope.displayAll = true;

		self.updatePlayerTurn(NineCache.gameObj.playerTurn);
		self.initDataStructures();
		self.handleSocketRequests();
		// console.log("my game obj:");
		// console.log(NineCache.gameObj);
	}

	self.init();

});
