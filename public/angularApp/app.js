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
	console.log("Hello Controller !");
	var self = this;
	self.currentGameState = "place";	// 'place' or 'move'

	self.board = [];
	for (var i = 0; i < 7; i++){
		self.board[i] = [];
		for (var k = 0; k < 7; k++){
			self.board[i][k] = null;
		}
	}

	//     0    1    2    3    4    5    6
	
	// 0  p0              p1             p2
	
	// 1        p8        p9       p10
	
	// 2             p16  p17  p18              
	
	// 3  p7    p15  p23       p19 p11   p3
	
	// 4             p22  p21  p20  
	
	// 5        p14       p13      p12
	
	// 6  p6              p5             p4

	// sample position object: { "player": "none", "neighbours": [ [0,3], [] }
	self.p1 = {};
	// self.p0 = "player1";
	self.p0 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	self.p1 = {"control": "free", "neighbours": [ [0, 0], [3, 1], [6, 0] ], "pclass": "" };
	self.p2 = {"control": "free", "neighbours": [ [3, 0], [6, 3] ], "pclass": "" };
	// self.p3 = {"control": "free", "neighbours": [ [6, 0], [5, 3], [6, 6] ], "pclass": "" };
	// self.p4 = {"control": "free", "neighbours": [ [6, 3], [3, 6] ], "pclass": "" };
	// self.p5 = {"control": "free", "neighbours": [ [0, 6], [3, 5], [6, 6] ], "pclass": "" };
	// self.p6 = {"control": "free", "neighbours": [ [0, 3], [3, 6] ], "pclass": "" };
	// self.p7 = {"control": "free", "neighbours": [ [0, 6], [0, 0], [1, 3] ], "pclass": "" };
	// self.p8 = {"control": "free", "neighbours": [ [3, 1], [1, 3] ], "pclass": "" };
	// self.p9 = {"control": "free", "neighbours": [ [3, 0], [1, 1], [5, 1], [3, 2] ], "pclass": "" };
	// self.p10 = {"control": "free", "neighbours": [ [3, 1], [5, 3] ], "pclass": "" };
	// self.p11 = {"control": "free", "neighbours": [ [5, 1], [5, 5], [6, 3], [4, 3] ], "pclass": "" };
	// self.p12 = {"control": "free", "neighbours": [ [5, 3], [3, 5] ], "pclass": "" };

	// self.p13 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p14 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p15 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p16 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p17 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p18 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p19 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p20 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p21 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p22 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };
	// self.p23 = {"control": "free", "neighbours": [ [3, 0], [0, 3] ], "pclass": "" };

	// self.p1 = {"control": "free", "neighbours": [ self.p0, self.p2 ] };
	// console.log("BLAH:");
	// console.log(self.p0);
	// console.log(self.p1);

	self.board[0][0] = self.p0;
	self.board[3][0] = self.p1;
	self.board[6][0] = self.p2;
	self.board[6][3] = self.p3;
	self.board[6][6] = self.p4;
	self.board[3][6] = self.p5;
	self.board[0][6] = self.p6;
	self.board[0][3] = self.p7;
	self.board[1][1] = self.p8;
	self.board[3][1] = self.p9;
	self.board[5][1] = self.p10;
	self.board[5][3] = self.p11;
	self.board[5][5] = self.p12;

	self.pinList = [];
	for (var i = 0; i < 3; i++){
		self.pinList.push(eval("self.p" + i));
	}
	
	console.log("pinlist:");
	console.log(self.pinList);

	self.mouseOverEvent = function(pinBtn){
		console.log("mouse over event");
		if (self.currentGameState === 'place'){
			pinBtn.pclass = "pinAvailablePlaceHover";
		} else if (self.currentGameState === 'move'){

		}
	}

	self.mouseOutEvent = function(pinBtn){
		console.log("mouse over event");
		if (self.currentGameState === 'place'){
			pinBtn.pclass = "";
		} else if (self.currentGameState === 'move'){

		}
	}

	self.clickEvent = function(pinBtn){
		console.log("click event");
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