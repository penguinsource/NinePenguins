var nineApp = angular.module('nineApp', ['ngCookies', 'ui.router'], function($httpProvider){

	// // Fix for sending AngularJS POST data using $http (to php as far as I know)
	// // -----------------------------------------------
	// // Use x-www-form-urlencoded Content-Type
	// $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	//   /**
	//    * The workhorse; converts an object to x-www-form-urlencoded serialization.
	//    * @param {Object} obj
	//    * @return {String}
	//    */ 
	//   var param = function(obj) {
	//     var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	      
	//     for(name in obj) {
	//       value = obj[name];
	        
	//       if(value instanceof Array) {
	//         for(i=0; i<value.length; ++i) {
	//           subValue = value[i];
	//           fullSubName = name + '[' + i + ']';
	//           innerObj = {};
	//           innerObj[fullSubName] = subValue;
	//           query += param(innerObj) + '&';
	//         }
	//       }
	//       else if(value instanceof Object) {
	//         for(subName in value) {
	//           subValue = value[subName];
	//           fullSubName = name + '[' + subName + ']';
	//           innerObj = {};
	//           innerObj[fullSubName] = subValue;
	//           query += param(innerObj) + '&';
	//         }
	//       }
	//       else if(value !== undefined && value !== null)
	//         query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	//     }
	      
	//     return query.length ? query.substr(0, query.length - 1) : query;
	//   };
	 
	//   // Override $http service's default transformRequest
	//   $httpProvider.defaults.transformRequest = [function(data) {
	//     return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	//   }];
	  // -----------------------------------------------
})
	.config(function($stateProvider, $urlRouterProvider){
		// $locationProvider.html5Mode(true);

		// $routeProvider
		// 	.when("/", {templateUrl: "angularApp/partials/topMenuCategories/homePage.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/homePage", {templateUrl: "angularApp/partials/topMenuCategories/homePage.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/qualityPage", {templateUrl: "angularApp/partials/topMenuCategories/qualityPage.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/psaGrading", {templateUrl: "angularApp/partials/topMenuCategories/psaGrading.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/customOrder", {templateUrl: "angularApp/partials/topMenuCategories/customOrder.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/cardConsignment", {templateUrl: "angularApp/partials/topMenuCategories/cardConsignment.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/sellyourCards", {templateUrl: "angularApp/partials/topMenuCategories/sellyourCards.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/faqPage", {templateUrl: "angularApp/partials/topMenuCategories/faqPage.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/contactUs", {templateUrl: "angularApp/partials/topMenuCategories/contactUs.html", controller: 'basicController', controllerAs: 'basicCtrl'})
		// 	.when("/browse/:cat?/:cat2?/:cat3?", {templateUrl: "angularApp/partials/browseContent.html"})
		// 	.when("/item/:itemName", {templateUrl: "angularApp/partials/singleProduct.html"})
		// 	.when("/shoppingCart", {templateUrl: "angularApp/partials/shoppingCart.html"})
		// 	.otherwise({ redirectTo: '/' });
		// ;

	  
      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        // .when('/c?id', '/contacts/:id')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/');

		$stateProvider
			.state('home',{ 	url: "/", templateUrl: "angularApp/partials/topMenuCategories/homePage.html",
								controller: 'basicController', controllerAs: 'basicCtrl'
			})
			.state('quality',{	url: "/quality", templateUrl: "angularApp/partials/topMenuCategories/qualityPage.html",
								controller: 'basicController', controllerAs: 'basicCtrl'   })
			;

	});

nineApp.controller('basicController', function($scope, $http){
	console.log("basicController !");
	var self = this;
	self.currentGameState = "place";	// 'place' or 'move'

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
				break;
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
				break;
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
		if (self.currentGameState=== 'place'){
			if (pinBtn.control === 'free'){
				pinBtn.pclass = "pinFreePlace";
			}
		} else if (self.currentGameState === 'move'){

		}
	}

	self.clickEvent = function(pinBtn, position){
		console.log("click event");
		console.log(pinBtn);
		if (self.currentGameState === 'place'){
			if (pinBtn.control === 'free'){
				pinBtn.control = self.playerColor;
				pinBtn.pclass = self.playerColor;
				self.checkForMills(pinBtn, position);
			}
		} else if (self.currentGameState === 'move'){

		}
		
	}



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