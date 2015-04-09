var nineApp = angular.module("nineApp");

nineApp.controller('mainController', function($scope, $http, Facebook, NineCache){
	var self = this;

	self.startAGame = function(){

	}

      // $scope.IntentLogin = function() {
      //   console.log("hey");
      //   // if(!userIsConnected) {
      //   //   $scope.login();
      //   // }
      // };

	self.initFacebookLogin = function(){

     // Define user empty data :/
      $scope.user = {};
      
      // Defining user logged status
      $scope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $scope.byebye = false;
      $scope.salutation = false;
      
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
        	if (newVal){
        		console.log("fb is ready .");
        		$scope.facebookReady = true;
        	}
        }
      );
      
      var userIsConnected = false;
      
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
        	console.log('im connected ');
        	userIsConnected = true;
        	$scope.logged = true;
        	$scope.me();
        }
      });
      
      /**
       * IntentLogin
       */
      $scope.IntentLogin = function() {
      	console.log("hey 22222222");
        if(!userIsConnected) {
        	console.log("hey 222222222333333332222");
        	$scope.login();
        }
      };
      
      /**
       * Login
       */
       $scope.login = function() {
       	console.log("logging in");
         Facebook.login(function(response) {
          if (response.status == 'connected') {
          	console.log('looogged');
            $scope.logged = true;
            $scope.me();
          }
        
        });
       };
       
        $scope.me = function() {
          Facebook.api('/me', function(response) {
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;
              console.log("user datass ");
              // console.log($scope.user);
              NineCache.userData = $scope.user;
              console.log(NineCache.userData);
            });
            
          });
        };
      
      $scope.logout = function() {
        Facebook.logout(function() {
          $scope.$apply(function() {
          	console.log("user logged out !");
            $scope.user   = {};
            $scope.logged = false;
            $scope.userIsConnected = false;
          });
        });
      }
      
      /**
       * Taking approach of Events :D
       */
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

	self.init = function(){
		console.log("mainController !");
		self.currentGameState = "place";	// 'place' or 'move'

		// Facebook
		self.initFacebookLogin();


	}

	self.init();
});
