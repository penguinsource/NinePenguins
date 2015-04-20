var nineApp = angular.module('nineApp', ['ngCookies', 'ui.router', 'facebook'], function($httpProvider){

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
	.config(function($stateProvider, $urlRouterProvider, FacebookProvider){
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
			.state('home',{ 	url: "/", templateUrl: "angularApp/partials/lobby.html",
								controller: 'lobbyController', controllerAs: 'lobbyCtrl'
			})
			.state('game',{	url: "/game/:game_id", templateUrl: "angularApp/partials/game.html",
								controller: 'gameController', controllerAs: 'gameCtrl'   })
			.state('other',{	url: "/game", templateUrl: "angularApp/partials/inGame.html",
								controller: 'gameController', controllerAs: 'gameCtrl'   })
			;

		FacebookProvider.init('1395028970809392');

	});



// nineApp.directive('sendMessagebtn', function() {
// 	return {
// 		restrict: 'E',
// 		replace: true,
// 		template: '<button id="sendMessageBtn">Send Message',
// 		link: function(scope, elem, attrs) {
// 			elem.bind('click', function() {
// 				var msgWrap = document.createElement("p");
// 				var msgAuthor = document.createElement("span");
// 				var msgText = document.createElement("span");
// 				var chatArea = document.getElementById('chatArea');
// 				scope.$apply(function(){
// 				  	msgAuthor.className = "userMessageAuthor";
// 				  	msgAuthor.textContent = scope.username;

// 				  	msgText.className = "userMessage";
// 				  	msgText.textContent = scope.messageText;

// 				  	msgWrap.className = "userMessageWrap";
// 				  	msgWrap.appendChild(msgAuthor);
// 				  	msgWrap.appendChild(msgText);
				  	
// 				  	chatArea.appendChild(msgWrap)
// 					chatArea.scrollTop = chatArea.scrollHeight;
// 					scope.messageText = '';
// 				});
// 				scope.postMessageToChat();
// 			});

// 			elem.bind('mouseover', function() {
// 				elem.css('cursor', 'pointer');
// 			});
// 		}
// 	};
// });

