app.controller('main_ctrl', ['$scope', '$window', 'task_svc', 'user_svc', function($scope, $window, task_svc, user_svc){

	this.refreshTasks = function(){
		task_svc.getAllTasks();
	};

	this.newTask = function(){

		var head_id = -1;
		if( task_svc.task_list.length > 0 ){
			head_id = task_svc.task_list[0].id;
		}

		if( user_svc.current_user && head_id !== null ){

			var t = new Task();
			t.poster_id   = user_svc.current_user.id;
			t.poster_name = user_svc.current_user.full_name;
			t.timestamp   = new Date();

			task_svc.task_list.unshift(t);

		}else if( !user_svc.current_user ){
			alert("Oops! You're not supposed to see this.  Only registered users can post tasks.");
		}

	};


	this.init = function(){
		this.refreshTasks();
		user_svc.getTaskCounts();
	};


	$scope.$watch(function(){ return user_svc.current_user; }, function(newValue, oldValue){

		// NOTE:  In the future, hopefully sessions will be implemented.  In that case, check the session value when the dashboard loads instead.

		if( newValue.id == null || newValue.id == undefined ){ // if we catch a user on the dashboard who isn't logged in, send them back to the login page

			// triggers on a page reload, which wipes the current_user field.
			// check sessionStorage, if sessionStore.getItem('user_id') does not exist, redirect to login

			var id = sessionStorage.getItem('user_id');
			if( id >= 0 ){
				// we're good, user is still logged in
				user_svc.refreshUser( id );
			}else{
				$window.location.href = "/"; // no user is logged in and no session exists
			}
		}
	});

}]);
