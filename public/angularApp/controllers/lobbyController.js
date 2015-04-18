var nineApp = angular.module("nineApp");

nineApp.controller('lobbyController', function($scope, $http, $state, Facebook, NineCache){
	var self = this;

	$scope.postMessageToChat = function(username, messageText, isMyMessage){
		// console.log("POSTING MESSAGE !");
		
		// emitting message to (server) and all the users present in the lobby
		if (isMyMessage){
			$scope.chatMessagesList.push({username: NineCache.username, message: messageText});
			NineCache.mySocket.emit('postLobbyMessage', 
				{ username: NineCache.username, message: messageText });
			$scope.messageText = '';
		} else {
			$scope.chatMessagesList.push({username: username, message: messageText});
		}

		var chatArea = document.getElementById('chatArea');
		chatArea.scrollTop = chatArea.scrollHeight;
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('updateLobbyChat', function (data) {
			if (NineCache.username != data.username){
		    	$scope.$apply(function(){
		    		console.log("UPDATING GUI:" + data.username);
		    		$scope.postMessageToChat(data.username, data.message, false);
		    	});
		    	
			}
		    // socket.emit('my other event', { my: 'data' });
		});

		NineCache.mySocket.on('updateLobbyUserList', function (data) {
		    	$scope.$apply(function(){
		    		console.log("LIST:");
		    		console.log(data.chatUsersList);
		    		$scope.chatUsersList = data.chatUsersList;

		    		for (var i in data.chatUsersList){
		    			console.log(data.chatUsersList[i]);
		    		}
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
		console.log(NineCache.userData);
		console.log(NineCache.userType);

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
