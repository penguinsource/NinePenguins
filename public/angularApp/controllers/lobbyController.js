var nineApp = angular.module("nineApp");

nineApp.controller('lobbyController', function($scope, $http, $state, Facebook, NineCache){
	var self = this;

	$scope.postMessageToChat = function(messageText){
		NineCache.mySocket.emit('postLobbyMessage', { username: NineCache.username, messageText: messageText });
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('updateLobbyChat', function (data) {
		    
		    // socket.emit('my other event', { my: 'data' });
		});
	}

	self.init = function(){
		console.log("lobbyController !");
		$scope.chatMessagesList = [ {author: 'Test', message: 'Again'} ];

		self.handleSocketRequests();

	}

	self.init();
});
