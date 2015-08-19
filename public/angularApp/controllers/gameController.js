var nineApp = angular.module("nineApp");

nineApp.controller('gameController', function($scope, $http, 
											  $stateParams, NineCache, 
											  $timeout){
	var self = this;

	self.requestTie = function(){
		console.log("requesting tie");
		// ******
	}

	self.quitGame = function(){
		console.log("quitting game");
		// ******
	}

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

	self.highlightMill = function(index1, index2, index3){
		console.log("updating message !");
		self.updateDisplayMsg("You made a mill ! Remove an enemy pin");
		console.log("highlighting mill");
		var pinObj1 = self.gameObj.board[index1].pinClasses;
		var pinObj2 = self.gameObj.board[index2].pinClasses;
		var pinObj3 = self.gameObj.board[index3].pinClasses;
		// console.log(self.gameObj);
		pinObj1.push("millHighlight");
		pinObj2.push("millHighlight");
		pinObj3.push("millHighlight");
		$timeout(function() {
			pinObj1.splice(pinObj1.indexOf("millHighlight"), 1);
			pinObj2.splice(pinObj2.indexOf("millHighlight"), 1);
			pinObj3.splice(pinObj3.indexOf("millHighlight"), 1);
		}, 3000);

	}

	self.updateDisplayMsg = function(message){
		self.displayMsg = message;
	}

	self.checkForMills = function(pinIndex){
		// var pinBtn = self.NineCache.gameObj.board[pinIndex];
		var pinBtn = self.gameObj.board[pinIndex];
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
				self.highlightMill(pinIndex, middlePinInd, otherPinInd);
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
				self.highlightMill(pinIndex, middlePinInd, otherPinInd);
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
					self.highlightMill(pinIndex, middlePinInd, otherPinInd);
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
					self.highlightMill(pinIndex, middlePinInd, otherPinInd);
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
					self.highlightMill(pinIndex, middlePinInd, otherPinInd);
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
					self.highlightMill(pinIndex, middlePinInd, otherPinInd);
					return retData;
				}
			}

		}
		return false;
	}

	self.getMyPlayerObject = function(){
		if (self.gameObj.p1Obj.pid == NineCache.userData.id){
			return self.gameObj.p1Obj;
		} else if (self.gameObj.p2Obj.pid == NineCache.userData.id){
			return self.gameObj.p2Obj;
		}
	}

	self.getOtherPlayerObject = function(){
		if (self.gameObj.p1Obj.pid == NineCache.userData.id){
			return self.gameObj.p2Obj;
		} else if (self.gameObj.p2Obj.pid == NineCache.userData.id){
			return self.gameObj.p1Obj;
		}
	}

	self.clickEvent = function(pinBtn, pinIndex){
		// var pinBtn = NineCache.gameObj.board[pinIndex];
		var pinBtn = self.gameObj.board[pinIndex];	// new
		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			// return;
		}
		// var myPlayerObj = NineCache.getMyPlayerObject();
		var myPlayerObj = self.getMyPlayerObject();
		switch(myPlayerObj.pState){
			case "place":
				self.placePin(pinIndex);
				break;
			case "remove":
				self.removePin(pinIndex);
				break;
			// case "move": // ************* to be implemented in the future

			default:
				// console.log("default code block called for some reason");
				// console.log(myPlayerObj.pState);
				// console.log(pinIndex);
				break;
		}
		// if(!$scope.$$phase) {
		//   $scope.$apply();
		// }
		
	}

	self.placePin = function(targetIndex){
		var myPlayerObj = self.getMyPlayerObject();
		var otherPlayerObj = self.getOtherPlayerObject();

		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}

		// check if target pin index is available
		if (!(self.gameObj.board[targetIndex].control == "pinFreePlace")){
			console.log("ERROR! Target pin index" + targetIndex +
						" is not available. It belongs to a player.");
			return;
		}

		// check if i have enough pins left to place
		if (myPlayerObj.pPlacePins < 1){
			console.log("ERROR! You don't have any pins left to place.");
		}

		// place pin
		self.board[targetIndex].control = self.playerLink;
		myPlayerObj.pPlacePins--;

		// check for mill detection
		var millData = self.checkForMills(targetIndex);

		if (millData){
			// keep my turn
			// change my gameState to 'remove'
			myPlayerObj.pState = "remove";
			
			console.log("MILL FORMED !!!!! my state is " + myPlayerObj.pState);
			// self.highlightRemovablePins();
			// self.forceScopeApply();

			var data = {
				userid: NineCache.userData.id,
				gameId: self.gameObj.gameId,
				pinIndex: targetIndex,
				newMill: millData
			};

			self.emitToServer("placePin", data);
			return;
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} 
			// else {
				// if player has 0 pins left to place, set their state to 'move'
				myPlayerObj.pState = self.updatePlayerState(myPlayerObj);

				// change player turn to the other player
				self.gameObj.playerTurn = otherPlayerObj.pid;
				// self.forceScopeApply();

				var data = {
					userid: NineCache.userData.id,
					gameId: self.gameObj.gameId,
					pinIndex: targetIndex,
					newMill: null
				};

				self.emitToServer("placePin", data);
				return;
			// }
			// self.updatePlayerTurn(NineCache.gameObj.otherPlayerId);
		}
	}

	self.indicesAreNeighbours = function(index1, index2){
		var indexObj = self.gameObj.board[index1];

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

		var myPlayerObj = self.getMyPlayerObject();
		var otherPlayerObj = self.getOtherPlayerObject();

		// DEPRECATED **
		// if (myPlayerObj.pState != "move"){
		// 	console.log("ERROR ! Your state is not move");
		// 	return;
		// }

		// check if target pin index is available
		if (!(self.gameObj.board[targetIndex].control == "pinFreePlace")){
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
		// $scope.$apply(function(){
			self.gameObj.board[sourceIndex].control = "pinFreePlace";
			self.gameObj.board[targetIndex].control = self.playerLink;
		// });

		var millData = self.checkForMills(targetIndex);
		if (millData){
			// change my state, keep my turn
			// $scope.$apply(function(){
				console.log(self.gameObj);
				myPlayerObj.pState = "remove";
			// });

			console.log("MILL FORMED !!!!! my state is " + myPlayerObj.pState);
			console.log(self.gameObj);

			// self.forceScopeApply();
			var data = {
				userid: NineCache.userData.id,
				gameId: self.gameObj.gameId,
				sourceIndex: sourceIndex,
				targetIndex: targetIndex,
				newMill: millData
			};

			self.emitToServer("movePin", data);
			return;
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} else {
				// change player turn to the other player
				self.gameObj.playerTurn = otherPlayerObj.pid;

				// self.forceScopeApply();
				// console.log("is it my turn: " + self.isMyTurn());

				var data = {
					userid: NineCache.userData.id,
					gameId: self.gameObj.gameId,
				  	sourceIndex: sourceIndex,
				  	targetIndex: targetIndex,
					newMill: null
				};

				self.emitToServer("movePin", data);
				return;
			}
		}
	}

	// force apply GUI, if it did not update !
	// sometimes the GUI does not get updated as a 'watch' misses a variable
	// update.. thus having to make this (painful) call. if a digest is not
	// currently happening, .. trigger watches to check their watched and update
	self.forceScopeApply = function(){
		if(!$scope.$$phase) {
			// console.log("forcing $apply");
			$scope.$apply();
		}
	}

	self.flyPin = function(sourceIndex, targetIndex){
		// check if it's my turn
		if (!self.isMyTurn()){
			console.log("ERROR! Not my turn");
			return;
		}

		var myPlayerObj = self.getMyPlayerObject();
		var otherPlayerObj = self.getOtherPlayerObject();
		var gameObj = self.gameObj;

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
		self.gameObj.board[sourceIndex].control = "pinFreePlace";
		self.gameObj.board[targetIndex].control = self.playerLink;

		var millData = self.checkForMills(targetIndex);
		if (millData){
			// change my state, keep my turn
			myPlayerObj.pState = "remove";
			// console.log("MILL FORMED !!!!!");
			// self.forceScopeApply();

			// send data to server
			var data = {
				userid: NineCache.userData.id,
				gameId: self.gameObj.gameId,
				sourceIndex: sourceIndex,
				targetIndex: targetIndex,
				newMill: millData
			};

			self.emitToServer("flyPin", data);
			return;
		} else {
			var gameConditions = self.checkGameConditions();
			if (gameConditions){
				console.log("YOU WON !!!!!!!!!!!!!!!!!!");
			} else {
				// change player turn to the other player
				self.gameObj.playerTurn = otherPlayerObj.pid;
				// self.forceScopeApply();

				var data = {
					userid: NineCache.userData.id,
					gameId: self.gameObj.gameId,
				  	sourceIndex: sourceIndex,
				  	targetIndex: targetIndex,
					newMill: null
				};

				self.emitToServer("flyPin", data);
				return;
			}
		}

	}

	// removeAction is a boolean that is null by default
	// this returns true if the game has been won by me (myPlayerObject)
	self.checkGameConditions = function(removeAction){
		// console.log("Checking game conditions");
		// var otherPlayerObj = NineCache.getOtherPlayerObject();
		var otherPlayerObj = self.getOtherPlayerObject();
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
			for (var i = 0; i < self.gameObj.board.length; i++){
				var tempPin = self.gameObj.board[i];
				if (tempPin.control == self.otherPlayerBoardName){
					console.log("temp pin:");
					console.log(tempPin);
					// now check if pin has any free neighbours
					for (var k = 0; k < tempPin.vNeighbours.length; k++){
						var t2PinInd = tempPin.vNeighbours[k];
						var t2Pin = self.gameObj.board[t2PinInd];
						console.log("t2pin:");
						console.log(t2Pin);
						if (t2Pin.control == self.freePinBoardName){
							return false;	// game not won
						}
					}
					for (var k = 0; k < tempPin.hNeighbours.length; k++){
						var t2PinInd = tempPin.hNeighbours[k];
						var t2Pin = self.gameObj.board[t2PinInd];
						console.log("t2pin:");
						console.log(t2Pin);
						if (t2Pin.control == self.freePinBoardName){
							return false;	// game not won
						}
					}
				}
			}
			// console.log("_+_+_+_+_+_+_ hello 2");
			console.log("win 3");
			return true;	// game won
		}
	}

	self.pinBelongsToPlayer = function(pinIndex, playerLink){
		return self.gameObj.board[pinIndex].control == playerLink;
	}

	self.displayPossibleMoves = function(pinBtn){
		if (self.gameObj.gameState === 'move'){

		} else if (self.gameObj.gameState === 'fly'){

		}
	}

	self.highlightRemovablePins = function(){
		self.gameObj.gameState = 'remove';
		self.calcRemovablePins();
	}

	// if true, then the user can remove pins that are currently
	// in a mill (have property 'isMill' set to true)
	self.calcRemovablePins = function(){
		var board = self.gameObj.board;
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
		if (self.gameObj.p1PinsLeft < 3){
			// Player 2 wins !
			// console.log("PLAYER 2 WINS !!!!!!!");
		} else if (self.gameObj.p2PinsLeft < 3){
			// Player 1 wins !
			// console.log("PLAYER 1 WINS !!!!!!!");
		}

		if ( (self.gameObj.p1PlacePins < 1) && (self.gameObj.p2PlacePins < 1) ){
			self.gameObj.gameState = "move";
		} else {
			self.gameObj.gameState = 'place';
		}

		if (self.gameObj.p1PinsLeft == 3){
			// console.log("!!!!!! player 1 can fly");
		}

		if (self.gameObj.p2PinsLeft == 3){
			// console.log("!!!!!! player 2 can fly");
		}
	}

	self.updatePlayerTurn = function(playerid){
		self.gameObj.playerTurn = playerid;
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
			var tempBoardName = self.gameObj.board[pinIndex].control;
			var pinsInMills = [];

			var freePins = 0;
			// check if there are any pins that are not in mills
			// if there are any, then this pin is not removeable
			for (var i = 0; i < self.gameObj.board.length; i++){
				var tempPin = self.gameObj.board[i];
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
		// console.log("=====> player obj is");
		// console.log(playerObj);
		if (playerObj.pPlacePins > 0){
			return "place";
		} else if (playerObj.pPinsLeft > 3){
			return "move";
		} else if (playerObj.pPinsLeft == 3){
			return "fly";
		} else if (playerObj.pPinsLeft < 3){
			return "lost game";
		} else {
			return playerObj.pState;	// ********* add the case below
		} 
		// ********** explore checking state here and reconsider using check game conditions removeAction boolean ***********
		  // else if (playerObj.pPinsLeft < 3){
		  // 	playerObj.pState = "dead";
		  // }
	}

	self.removePin = function(pinIndex){
		var pinBtn = self.gameObj.board[pinIndex];
		// check that the target pin index belongs to the other player
		if (self.gameObj.board[pinIndex].control != self.otherPlayerBoardName){
			console.log("ERROR! Can't remove pin that doesn't belong to "+
						"the other player");
			return;
		}

		// check if pin at pinIndex can be removed
		if (!self.canRemovePin(pinIndex)){
			console.log("ERROR 2! Can't remove pin");
			return;
		}

		// remove player control from pinIndex
		self.gameObj.board[pinIndex].control = self.freePinBoardName;
		// decrease the other player's pins left
		var otherPlayerObj = self.getOtherPlayerObject();
		otherPlayerObj.pPinsLeft--;

		var myPlayerObj = self.getMyPlayerObject();
		myPlayerObj.pState = self.updatePlayerState(myPlayerObj);
		otherPlayerObj.pState = self.updatePlayerState(otherPlayerObj);

		//1) *** TRY MAKING A MILL IN STATE PLACE, you will keep staying in state remove even next turn
		//2) i win game if the other place has 2 pins left on the board ? fix that !

		var gameConditions = self.checkGameConditions();
		if (gameConditions){
			// game WON
			// console.log("I WON THE GAME !");
		} else {
			// changing player turn
			self.gameObj.playerTurn = otherPlayerObj.pid;
		}

		var data = {
			gameId: self.gameObj.gameId,
			userid: NineCache.userData.id,
			pinIndex: pinIndex
		};
		// self.forceScopeApply();
		self.emitToServer("removePin", data);
	}

	self.emitToServer = function(requestType, data){
		// console.log("Emitting to server:" + requestType);
		// console.log(data);
		if (self.testObj){
			data.testObj = self.testObj;
			NineCache.mySocket.emit(requestType, data);
		} else {
			NineCache.mySocket.emit(requestType, data);
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
	}

	self.isMyTurn = function(){
		// return (NineCache.gameObj.playerTurn == NineCache.userData.id);
		return (self.gameObj.playerTurn == NineCache.userData.id);
	}

	self.handleSocketRequests = function(){
		
		NineCache.mySocket.on('placePin', function (data) {
			// $scope.$apply(function(){
				// console.log("====================");
				// console.log(data);
				if (self.gameObj.gameId == data.gameId){
					var otherPlayerObj = self.getOtherPlayerObject();
					var otherPLink = 'player2Pin';
					
					otherPlayerObj.pPlacePins--;

					var otherPlayerObj = self.getOtherPlayerObject();
					// otherPlayerObj.pState = data.otherPlayerState;
					var myPlayerObj = self.getMyPlayerObject();			

					$scope.$apply(function(){
						myPlayerObj.pState = 
										self.updatePlayerState(myPlayerObj);	
						otherPlayerObj.pState = 
										self.updatePlayerState(otherPlayerObj);	
						self.gameObj.board[data.pinIndex].control = 
														self.otherPlayerBoardName;
						self.updatePlayerTurn(data.playerTurn);					
					});
					
					if (data.testObj){
						self.playTest(data.testObj);
					}
					// self.forceScopeApply();
				} else {
					console.log("ERROR ! Received data about wrong game obj"+
								" from the server.");
				}
			// });
		});

		NineCache.mySocket.on('movePin', function (data) {
			if (self.gameObj.gameId == data.gameId){
				console.log("move pin data received:");
				console.log(data);

				var otherPLink = 'player2Pin';
				var myPlayerObj = self.getMyPlayerObject();
				var otherPlayerObj = self.getOtherPlayerObject();

				$scope.$apply(function(){
					myPlayerObj.pState = 
									self.updatePlayerState(myPlayerObj);
					otherPlayerObj.pState = 
									self.updatePlayerState(otherPlayerObj);
					self.gameObj.board[data.sourceIndex].control = 
													self.freePinBoardName;
					self.gameObj.board[data.targetIndex].control = 
													self.otherPlayerBoardName;
					if (!data.newMill){
						self.gameObj.playerTurn = NineCache.userData.id;
					}
				});

				// self.forceScopeApply();
				if (data.testObj){
					self.playTest(data.testObj);
				}
			} else {
				console.log("ERROR ! Received data about wrong game obj"+
							" from the server.");
			}
		});

		NineCache.mySocket.on("flyPin", function(data){
			console.log("fly pin data received:");
			console.log(data);
			if (self.gameObj.gameId == data.gameId){
				$scope.$apply(function(){
					self.gameObj.board[data.sourceIndex].control = 
														self.freePinBoardName;
					self.gameObj.board[data.targetIndex].control = 
														self.otherPlayerBoardName;
					console.log("My Pin::: ");
					console.log(self.gameObj.board[sourceIndex].control);
					// console.log(data);
					if (!data.newMill){
						// $scope.$apply(function(){
							self.gameObj.playerTurn = NineCache.userData.id;
						// });
					}
				});
				// self.forceScopeApply();
				if (data.testObj){
					self.playTest(data.testObj);
				}
			}
		});

		NineCache.mySocket.on('removePin', function (data) {
			console.log("remove pin data received:");
			console.log(data);
			if (self.gameObj.gameId == data.gameId){
				var player = 'player2Pin';
				var myPlayerObj = self.getMyPlayerObject();
				var otherPlayerObj = self.getMyPlayerObject();

				$scope.$apply(function(){
					myPlayerObj.pPinsLeft--;
					myPlayerObj.pState = 
									self.updatePlayerState(myPlayerObj);
					otherPlayerObj.pState = 
									self.updatePlayerState(otherPlayerObj);
					self.gameObj.board[data.pinIndex].control = 
						self.freePinBoardName;
						console.log("aaaaaaaaaaa");
						console.log(self.gameObj.board[data.pinIndex].control);
					self.updatePlayerTurn(data.playerTurn);
				});

				// self.forceScopeApply();
				if (data.testObj){
					self.playTest(data.testObj);
				}
			}
		});
	}

	self.startTest = function(testNo){
		// if (testNo == "1"){
		// 	self.testObj = {
		// 		testNumber: "1",
		// 		testStep: "1"
		// 	};
		// 	// waitSeconds(2000);
		// 	self.testObj.testStep++;
		// 	self.placePin(0);
		// }
		var testObj = {
			testNumber: testNo,
			testStep:1
		};
		self.playTest(testObj);
	}
// 5:43, terminal 3
	self.playTest = function(testObj){
		self.testObj = testObj;
		var enableTimeout = true;
		var timeBetweenMoves = 0;
		console.log(testObj);
		if (self.testObj.testNumber == 1){
			// var t = [0,15,1,9,7,6,5,13,4,2,3,11,12,16,14,20,8,18];
			// var ind = t[testObj.testStep];
			// $timeout(function(){
			// 	self.placePin(ind);
			// }, timeBetweenMoves);
			
			// console.log(testObj.testStep);
			// if (testObj.testStep == (t.length-1)){
			//     console.log("end game object:");
			//     console.log(self.gameObj);
			// }
			// testObj.testStep++;
			console.log("test obj");
			console.log(testObj);
			switch(testObj.testStep){
				case 1:
					self.testObj.testStep++;
					$timeout(function(){
						self.placePin(0);
					}, timeBetweenMoves);
					break;
				case 2:
					self.testObj.testStep++;
					$timeout(function(){
						self.placePin(15);
					}, timeBetweenMoves);
					break;
				case 3:
					self.testObj.testStep++;
					$timeout(function(){
						self.placePin(1);
					}, timeBetweenMoves);
					break;
				case 4:
					self.testObj.testStep++;
					$timeout(function(){
						self.placePin(9);
					}, timeBetweenMoves);
					break;
				case 5:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(7);
				    }, timeBetweenMoves);
					break;
				case 6:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(6);
				    }, timeBetweenMoves);
					break;
				case 7:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(5);
				    }, timeBetweenMoves);
					break;
				case 8:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(13);
				    }, timeBetweenMoves);
					break;
				case 9:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(4);
				    }, timeBetweenMoves);
					break;
				case 10:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(2);
				    }, timeBetweenMoves);
					break;
				case 11:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(3);
				    }, timeBetweenMoves);
					break;
				case 12:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(11);
				    }, timeBetweenMoves);
					break;
				case 13:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(12);
				    }, timeBetweenMoves);
					break;
				case 14:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(16);
				    }, timeBetweenMoves);
					break;
				case 15:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(14);
				    }, timeBetweenMoves);
					break;
				case 16:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(20);
				    }, timeBetweenMoves);
					break;
				case 17:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(8);
				    }, timeBetweenMoves);
					break;
				case 18:
					self.testObj.testStep++;
					$timeout(function() {
				        self.placePin(18);
				    }, timeBetweenMoves);
				    console.log("end game object:");
				    console.log(self.gameObj);
					break;
			}
		}
	}

	function waitSeconds(iMilliSeconds){
	    var counter= 0
	        , start = new Date().getTime()
	        , end = 0;
	    while (counter < iMilliSeconds) {
	        end = new Date().getTime();
	        counter = end - start;
	    }
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
			  {"vNeighbours": [ 7 ], 
			   "hNeighbours": [ 1 ]},
			  {"vNeighbours": [ 9 ], 
			   "hNeighbours": [ 0, 2 ]},
			  {"vNeighbours": [ 3 ], 
			   "hNeighbours": [ 1 ]},
			  {"vNeighbours": [ 2, 4 ], 
			   "hNeighbours": [ 11 ]},
			  {"vNeighbours": [ 3 ], 
			   "hNeighbours": [ 5 ]},
			  {"vNeighbours": [ 13 ], 
			   "hNeighbours": [ 4, 6 ]},
			  {"vNeighbours": [ 7 ], 
			   "hNeighbours": [ 5 ]},
			  {"vNeighbours": [ 0, 6 ], 
			   "hNeighbours": [ 15 ]},
			  {"vNeighbours": [ 15 ], 
			   "hNeighbours": [ 9 ]},
			  {"vNeighbours": [ 1, 17 ], 
			   "hNeighbours": [ 8, 10 ]},
			  {"vNeighbours": [ 11 ], 
			   "hNeighbours": [ 9 ]},
			  {"vNeighbours": [ 10, 12 ], 
			   "hNeighbours": [ 3, 19 ]},
			  {"vNeighbours": [ 11 ], 
			   "hNeighbours": [ 13 ]},
			  {"vNeighbours": [ 5, 21 ], 
			   "hNeighbours": [ 12, 14 ]},
			  {"vNeighbours": [ 15 ], 
			   "hNeighbours": [ 13 ]},
			  {"vNeighbours": [ 8, 14 ], 
			   "hNeighbours": [ 7, 23 ]},
			  {"vNeighbours": [ 23 ], 
			   "hNeighbours": [ 17 ]},
			  {"vNeighbours": [ 9 ], 
			   "hNeighbours": [ 16, 18 ]},
			  {"vNeighbours": [ 19 ], 
			   "hNeighbours": [ 17 ]},
			  {"vNeighbours": [ 18, 20 ], 
			   "hNeighbours": [ 11 ]},
			  {"vNeighbours": [ 19 ], 
			   "hNeighbours": [ 21 ]},
			  {"vNeighbours": [ 13 ], 
			   "hNeighbours": [ 20, 22 ]},
			  {"vNeighbours": [ 23 ], 
			   "hNeighbours": [ 21 ]},
			  {"vNeighbours": [ 16, 22 ], 
			   "hNeighbours": [ 15 ]}
			];

		for (var i=0; i< self.board.length; i++){
			self.board[i].pinClasses = [];
			self.board[i].control = "pinFreePlace";
			self.board[i].isMill = false;
		}

		// self.playerColor = 'player1Pin';
		self.playerLink = "player1Pin";
		self.otherPlayerBoardName = "player2Pin";
		self.freePinBoardName = "pinFreePlace";
		// self.canRemoveMillPin = false;	//

		// initiate testMode variable; if true, every emit to server will send
		// a test object
		self.testObj = null;
		// NineCache.gameObj.board = self.board;

		self.gameObj = NineCache.gameObj;	// new ..
		self.gameObj.board = self.board;

		if (self.isMyTurn()){ 
			self.updateDisplayMsg("Please place a pin!");
		} else {
			self.updateDisplayMsg("Waiting for the other player..");
		}
	}

	self.getMyPlayerName = function(){
		var myPlayerObj = (NineCache.userData.id === self.gameObj.p1Obj.pid)?
							self.gameObj.p1Obj : self.gameObj.p2Obj;
		return (myPlayerObj.pUserName != "") ?
					myPlayerObj.pUserName : myPlayerObj.pid;
	}

	self.getOtherPlayerName = function(){
		var myPlayerObj = (NineCache.userData.id === self.gameObj.p1Obj.pid)?
							self.gameObj.p2Obj : self.gameObj.p1Obj;
		return (myPlayerObj.pUserName != "") ?
					myPlayerObj.pUserName : myPlayerObj.pid;
	}

	self.getMyPlayerObj = function(){
		return (NineCache.userData.id === self.gameObj.p1Obj.pid)?
					self.gameObj.p1Obj : self.gameObj.p2Obj;
	}

	self.init = function(){
		console.log("Game Controller !");

		self.debug = true;
		self.NineCache = NineCache;
		NineCache.logoClass = "logoMin";
		NineCache.setVisibleTopGameBtns(false);

		self.updateDisplayMsg("You made a mill ! Remove an enemy pin");
		// console.log("PARAM:");
		// console.log($stateParams['game_id']);
		$scope.displayAll = true;

		// self.updatePlayerTurn(NineCache.gameObj.playerTurn);
		self.initDataStructures();
		self.handleSocketRequests();
		console.log("my game obj:");
		// console.log(NineCache.gameObj);
		console.log(self.gameObj);
	}

	self.init();

});
