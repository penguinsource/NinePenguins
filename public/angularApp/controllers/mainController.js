var nineApp = angular.module("nineApp");

nineApp.controller('mainController', function($scope, $http){
	console.log("mainController !");
	var self = this;
	self.currentGameState = "place";	// 'place' or 'move'
	console.log("my:");


	//     0    1    2    3    4    5    6
	
	// 0  p0              p1             p2
	
	// 1        p8        p9       p10
	
	// 2             p16  p17  p18              
	
	// 3  p7    p15  p23       p19 p11   p3
	
	// 4             p22  p21  p20  
	
	// 5        p14       p13      p12
	
	// 6  p6              p5             p4

	// sample position object: { "player": "none", "neighbours": [ [0,3], [] }
	// self.p0 = "player1";
	self.p0 = {"control": "free", "vNeighbours": [ 7 ], "hNeighbours": [ 1 ], "pclass": "pinFreePlace" };
	self.p1 = {"control": "free", "vNeighbours": [ 9 ], "hNeighbours": [ 0, 2 ], "pclass": "pinFreePlace" };
	self.p2 = {"control": "free", "vNeighbours": [ 3 ], "hNeighbours": [ 1 ], "pclass": "pinFreePlace" };
	self.p3 = {"control": "free", "vNeighbours": [ 2, 4 ], "hNeighbours": [ 11 ], "pclass": "pinFreePlace" };
	self.p4 = {"control": "free", "vNeighbours": [ 3 ], "hNeighbours": [ 5 ], "pclass": "pinFreePlace" };
	self.p5 = {"control": "free", "vNeighbours": [ 13 ], "hNeighbours": [ 4, 6 ], "pclass": "pinFreePlace" };
	self.p6 = {"control": "free", "vNeighbours": [ 7 ], "hNeighbours": [ 5 ], "pclass": "pinFreePlace" };
	self.p7 = {"control": "free", "vNeighbours": [ 0, 6 ], "hNeighbours": [ 15 ], "pclass": "pinFreePlace" };
	self.p8 = {"control": "free", "vNeighbours": [ 15 ], "hNeighbours": [ 9 ], "pclass": "pinFreePlace" };
	self.p9 = {"control": "free", "vNeighbours": [ 1, 17 ], "hNeighbours": [ 8, 10 ], "pclass": "pinFreePlace" };
	self.p10 = {"control": "free", "vNeighbours": [ 11 ], "hNeighbours": [ 9 ], "pclass": "pinFreePlace" };
	self.p11 = {"control": "free", "vNeighbours": [ 10, 12 ], "hNeighbours": [ 3, 19 ], "pclass": "pinFreePlace" };
	self.p12 = {"control": "free", "vNeighbours": [ 11 ], "hNeighbours": [ 13 ], "pclass": "pinFreePlace" };
	self.p13 = {"control": "free", "vNeighbours": [ 5, 21 ], "hNeighbours": [ 12, 14 ], "pclass": "pinFreePlace" };
	self.p14 = {"control": "free", "vNeighbours": [ 15 ], "hNeighbours": [ 13 ], "pclass": "pinFreePlace" };
	self.p15 = {"control": "free", "vNeighbours": [ 8, 14 ], "hNeighbours": [ 7, 23 ], "pclass": "pinFreePlace" };
	self.p16 = {"control": "free", "vNeighbours": [ 23 ], "hNeighbours": [ 17 ], "pclass": "pinFreePlace" };
	self.p17 = {"control": "free", "vNeighbours": [ 9 ], "hNeighbours": [ 16, 18 ], "pclass": "pinFreePlace" };
	self.p18 = {"control": "free", "vNeighbours": [ 19 ], "hNeighbours": [ 17 ], "pclass": "pinFreePlace" };
	self.p19 = {"control": "free", "vNeighbours": [ 18, 20 ], "hNeighbours": [ 11 ], "pclass": "pinFreePlace" };
	self.p20 = {"control": "free", "vNeighbours": [ 19 ], "hNeighbours": [ 21 ], "pclass": "pinFreePlace" };
	self.p21 = {"control": "free", "vNeighbours": [ 13 ], "hNeighbours": [ 20, 22 ], "pclass": "pinFreePlace" };
	self.p22 = {"control": "free", "vNeighbours": [ 23 ], "hNeighbours": [ 21 ], "pclass": "pinFreePlace" };
	self.p23 = {"control": "free", "vNeighbours": [ 16, 22 ], "hNeighbours": [ 15 ], "pclass": "pinFreePlace" };

	self.pinList = [];
	for (var i = 0; i < 24; i++){
		var obj = eval("self.p" + i);
		obj.ind = i;
		self.pinList.push(obj);
	}
	
	console.log("pinlist:");
	console.log(self.pinList);

	self.playerColor = 'player1pin';

	self.isEven = function(n) {
	  return n === parseFloat(n)? !(n%2) : void 0;
	}

	self.checkForMills = function(pinBtn, position){
		if (self.isEven(position)){
			console.log("its even !");
			var middlePin = eval("self.p" + pinBtn.hNeighbours);
			var otherPin = {};
			for (var i = 0; i < middlePin.hNeighbours.length; i++){
				if (middlePin.hNeighbours[i] != pinBtn.ind){
					otherPin = eval("self.p" + middlePin.hNeighbours[i]);
				}
			}
			console.log("my pin index is: " + pinBtn.ind);
			console.log("middle pin index is: " + middlePin.ind);
			console.log("other pin index is: " + otherPin.ind);
		} else {
			console.log("its odd !");
			// pinBtn.animate
			// check for horizontal mill
			var horizontalMill = true;
			for (var i = 0; i < pinBtn.hNeighbours.length; i++){
				if (pinBtn.hNeighbours[i].control != self.playerColor){
					horizontalMill = false;
					break;
				}
			}
			if (horizontalMill){
				// highlight mill
				// break;
			}
			
			// check for vertical mill
			var verticalMill = true;
			for (var i = 0; i < pinBtn.hNeighbours.length; i++){
				if (pinBtn.hNeighbours[i].control != self.playerColor){
					verticalMill = false;
					break;
				}
			}
			if (verticalMill){
				// highlight mill
				// break;
			}
		}
	}

	self.mouseOverEvent = function(pinBtn){
		console.log("mouse over event");
		if (self.currentGameState === 'place'){
			pinBtn.pclass = self.playerColor;
		} else if (self.currentGameState === 'move'){
			if (pinBtn.control === "free"){
				pinBtn.pclass = self.playerColor;
			}
		}
	}

	self.mouseOutEvent = function(pinBtn){
		console.log("mouse over event");
		console.log(pinBtn);
		if (self.currentGameState=== 'place'){
			if (pinBtn.control === 'free'){
				pinBtn.pclass = "pinFreePlace";
			}
		} else if (self.currentGameState === 'move'){

		}
	}

	self.clickEvent = function(pinBtn, position){
		console.log("click event, position " + position);
		console.log(pinBtn);
		if (self.currentGameState === 'place'){
			if (pinBtn.control === 'free'){
				pinBtn.control = self.playerColor;
				pinBtn.pclass = self.playerColor;
				self.checkForMills(pinBtn, position);
			}
		} else if (self.currentGameState === 'move'){

		}

		console.log("socket:");
		var io = require('socket.io')(8080);
		
	}

	// player = playerMe
	self.placePin = function(player, position){

	}

	
	// $('form').submit(function(){
	// socket.emit('chat message', $('#m').val());
	// 	$('#m').val('');
	// 	return false;
	// });
	// socket.on('chat message', function(msg){
	// 	console.log("GOT MESSAGE:" + msg);
	// 	$('#messages').append($('<li>').text(msg));
	// });

	console.log("board:");
	console.log(self.board);

	$scope.sendPost = function(){
		console.log("POST Request");
	    $http.post('http://localhost:3000/')
	    	.success(function(data, status, headers, config) {
	        	console.log("DATAAAAAAAAAAAA:");
	        	console.log(data);
	        // self.catList = data;
	    });
	};
	
	$scope.sendGet = function(){
		console.log("GET Request");
	    $http.delete('http://localhost:3000/')
	    	.success(function(data, status, headers, config) {
	        	// console.log("DATAAAAAAAAAAAA:");
	        	// console.log(data);
	        // self.catList = data;
	    });
	};
});
