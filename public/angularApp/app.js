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
	self.p0 = {"control": "free", "neighbours": [ 1, 7 ], "pclass": "pinFreePlace" };
	self.p1 = {"control": "free", "neighbours": [ 0, 2, 9 ], "pclass": "pinFreePlace" };
	self.p2 = {"control": "free", "neighbours": [ 1, 3 ], "pclass": "pinFreePlace" };
	self.p3 = {"control": "free", "neighbours": [ 2, 4, 11 ], "pclass": "pinFreePlace" };
	self.p4 = {"control": "free", "neighbours": [ 3, 5 ], "pclass": "pinFreePlace" };
	self.p5 = {"control": "free", "neighbours": [ 4, 6, 13 ], "pclass": "pinFreePlace" };
	self.p6 = {"control": "free", "neighbours": [ 5, 7 ], "pclass": "pinFreePlace" };
	self.p7 = {"control": "free", "neighbours": [ 0, 6, 15 ], "pclass": "pinFreePlace" };
	self.p8 = {"control": "free", "neighbours": [ 9, 15 ], "pclass": "pinFreePlace" };
	self.p9 = {"control": "free", "neighbours": [ 1, 8, 10, 17 ], "pclass": "pinFreePlace" };
	self.p10 = {"control": "free", "neighbours": [ 9, 11 ], "pclass": "pinFreePlace" };
	self.p11 = {"control": "free", "neighbours": [ 3, 10, 12, 19 ], "pclass": "pinFreePlace" };
	self.p12 = {"control": "free", "neighbours": [ 11, 13 ], "pclass": "pinFreePlace" };
	self.p13 = {"control": "free", "neighbours": [ 5, 12, 14, 21 ], "pclass": "pinFreePlace" };
	self.p14 = {"control": "free", "neighbours": [ 13, 15 ], "pclass": "pinFreePlace" };
	self.p15 = {"control": "free", "neighbours": [ 7, 8, 14, 23 ], "pclass": "pinFreePlace" };
	self.p16 = {"control": "free", "neighbours": [ 17, 23 ], "pclass": "pinFreePlace" };
	self.p17 = {"control": "free", "neighbours": [ 9, 16, 18 ], "pclass": "pinFreePlace" };
	self.p18 = {"control": "free", "neighbours": [ 17, 19 ], "pclass": "pinFreePlace" };
	self.p19 = {"control": "free", "neighbours": [ 11, 18, 20 ], "pclass": "pinFreePlace" };
	self.p20 = {"control": "free", "neighbours": [ 19, 21 ], "pclass": "pinFreePlace" };
	self.p21 = {"control": "free", "neighbours": [ 13, 20, 22 ], "pclass": "pinFreePlace" };
	self.p22 = {"control": "free", "neighbours": [ 21, 23 ], "pclass": "pinFreePlace" };
	self.p23 = {"control": "free", "neighbours": [ 15, 16, 22 ], "pclass": "pinFreePlace" };

	self.pinList = [];
	for (var i = 0; i < 24; i++){
		self.pinList.push(eval("self.p" + i));
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
		} else {
			console.log("its odd !");
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