var nineApp = angular.module("nineApp");

nineApp.controller('lobbyController', function($scope, $http, $state, Facebook, NineCache){
	var self = this;

	$scope.postMessageToChat = function(username, messageText, isMyMessage){
		console.log("POSTING MESSAGE !");
		var chatArea = document.getElementById('chatArea');
		$scope.chatMessagesList.push({username: username, message: messageText});
		
		// emitting message to (server) and all the users present in the lobby
		if (isMyMessage){
			NineCache.mySocket.emit('postLobbyMessage', 
				{ username: NineCache.username, message: messageText });
			$scope.messageText = '';
		}

		chatArea.scrollTop = chatArea.scrollHeight;
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('updateLobbyChat', function (data) {
			if (NineCache.username != data.username){
		    	$scope.$apply(function(){
		    		$scope.postMessageToChat(data.username, data.message, false);
		    	});
		    	
			}
		    // socket.emit('my other event', { my: 'data' });
		});

		NineCache.mySocket.on('updateLobbyUsersList', function (data) {
		    	$scope.$apply(function(){
		    		console.log("LIST:");
		    		console.log(data);
		    		$scope.chatUsersList = data.chatUsersList;
		    		// $scope.postMessageToChat('', data.message, true);
		    	});		    
		});

	}

	self.checkEnterKeyPress = function(keyEvent){
		if ($scope.messageText != ''){
			if (keyEvent.which === 13){
				$scope.postMessageToChat(NineCache.username, $scope.messageText, true);
			}
		}
	}

	self.initLobbyData = function(){
		$scope.chatMessagesList = [];
		$scope.chatUsersList = [];
		NineCache.mySocket.emit('addUserToLobby', 
			{ username: NineCache.username, userid: NineCache.userData.id });
	}

	self.init = function(){
		console.log("lobbyController !");


		self.initLobbyData();
		self.handleSocketRequests();
	}

	self.init();
});
