var pokeApp = angular.module("nineApp");

// used to cache various data for optimization and store some global vars
pokeApp.service('NineCache', function(){
	var self = this;

	self.userData = {};
	self.userType = 'guest';	// {guest, facebook}
	self.mySocket = null;

	this.setUserTypeToGuest = function(){
		self.userType = 'guest';	// !!!!!!!!!!! set random char name
	}

});
