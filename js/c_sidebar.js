app.controller('sidebar_ctrl', ['$scope', '$interval', 'user_svc', function($scope, $interval, user_svc){



	this.initials  = "";
	this.fullname  = "";
	this.username  = "";
	this.balance   = 0;
	this.posted    = 0;
	this.completed = 0;


	this.refresh = function(){
		user_svc.refreshUser(user_svc.current_user.id);
		user_svc.getTaskCounts();
	};


	this.logout = function(){
		user_svc.logout();
	};

	$interval(this.refresh, 5000);


	$scope.$watch(function(){ return user_svc.current_user; }, function(newValue){

		if( newValue !== false ){

			var first = newValue.first.substr(0,1).toUpperCase();
			var last  = newValue.last.substr(0,1).toUpperCase();

			this.initials = (first + last);

			this.fullname = newValue.full_name;

			this.username = newValue.username;

			this.balance  = newValue.balance;

		}

	}.bind(this));


	$scope.$watch(function(){ return user_svc.posted; }, function(newValue){

		this.posted = newValue;

	}.bind(this));


	$scope.$watch(function(){ return user_svc.completed; }, function(newValue){

		this.completed = newValue;

	}.bind(this));

}]);
