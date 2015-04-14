var nineApp = angular.module("nineApp");

nineApp.controller('mainController', function($scope, $http, $state, Facebook, NineCache){
	var self = this;

	self.startAGame = function(){
		console.log("FB user name: ");
		console.log(NineCache.userData);

		NineCache.mySocket.emit('addPlayerToQueue', 
			{ username: NineCache.username, 
			  userid: 	NineCache.userData.id });
	}

	self.initFacebookLogin = function(){

		// Watch for Facebook to be ready
		$scope.$watch(
			function() {
			  return Facebook.isReady();
			},
			function(newVal) {
				if (newVal){
					$scope.facebookReady = true;
				}
			}
		);

		Facebook.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				console.log('im connected ');
				NineCache.userType = 'facebook';
				$scope.me();
			}
		});
      
		$scope.IntentLogin = function() {
			if(NineCache.userType == 'guest') {
				$scope.login();
			} else {
				console.log('User is already logged in');
				// console.log(NineCache.userData);
			}
		};
      
		$scope.login = function() {
			console.log("logging in");
			Facebook.login(function(response) {
				if (response.status == 'connected') {
					$scope.me();
				}
			});
		};

		$scope.me = function() {
			Facebook.api('/me', function(response) {
				// Using $scope.$apply since this happens outside angular framework.
				$scope.$apply(function() {
					NineCache.userType = "facebook";
					NineCache.userData = response;
					self.setUsername();
					// console.log("FB user name: ");
					// console.log(NineCache.userData);
				});
			});
		};
      
		$scope.logout = function() {
			Facebook.logout(function() {
				$scope.$apply(function() {
					console.log("user logged out !");
					NineCache.setUserTypeToGuest();
					$scope.userData   = {};
				});
			});
		}
      
      /**
       * Taking approach of Events :D
       */
      // And some fancy flags to display messages upon user status change
      // $scope.byebye = false;
      // $scope.salutation = false;
      // $scope.$on('Facebook:statusChange', function(ev, data) {
      //   console.log('Status: ', data);
      //   if (data.status == 'connected') {
      //     $scope.$apply(function() {
      //       $scope.salutation = true;
      //       $scope.byebye     = false;    
      //     });
      //   } else {
      //     $scope.$apply(function() {
      //       $scope.salutation = false;
      //       $scope.byebye     = true;
            
      //       // Dismiss byebye message after two seconds
      //       $timeout(function() {
      //         $scope.byebye = false;
      //       }, 2000)
      //     });
      //   }
        
        
      // });

	}

	self.connectToServer = function(){
		var mySocket = io.connect('http://50.65.103.143:3000/');
		NineCache.mySocket = mySocket;
		// mySocket.on('news', function (data) {
		// 	console.log(data);
		// 	mySocket.emit('blah', { my: 'data blah' });
		// });
	}

	self.handleSocketRequests = function(){
		NineCache.mySocket.on('gameMatched', function (data) {
		    $state.go('game');
		    // socket.emit('my other event', { my: 'data' });
		});
	}

	self.setUsername = function(){
		if (self.NineCache.userType === 'guest'){
			$scope.username = self.NineCache.userData.id;
			NineCache.username = $scope.username;
		} else if (self.NineCache.userType === 'facebook'){
			$scope.username = self.NineCache.userData.first_name;
			NineCache.username = $scope.username;
		}
	}


	$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams){
		// console.log("===============================================");
		// console.log("To State:");
		// console.log(toState.name);
		// console.log("From State:");
		// console.log("===============================================");
	});

	self.init = function(){
		console.log("mainController !");
		self.currentGameState = "place";	// 'place' or 'move'
		self.NineCache = NineCache;
		
		NineCache.userData.id = "guest_" + window.Math.random().toString(36).substring(7);
		NineCache.userType = 'guest';
		self.setUsername();

		// Facebook
		self.initFacebookLogin();		
		self.connectToServer();
		self.handleSocketRequests();
	}

	self.init();
});
