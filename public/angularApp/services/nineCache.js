var pokeApp = angular.module("nineApp");

// used to cache various data for optimization and store some global vars
pokeApp.service('NineCache', function(){
	var self = this;
	self.currUser = {};
	self.userData = {};
	self.userStatus = {};	// 

	this.setLastProductCached = function(product){
		self.lastProductCached = product;
	}
});
