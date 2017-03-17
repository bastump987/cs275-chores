app.service('task_svc', ['$http', function($http){

	this.task_list = []; // stores results of latest function call

	this.getAllTasks = function(limit){
		/*
			Makes an AJAX request to retrieve an array of JSON objects,
			identical in structure to the Task prototype in 'app.js'.

			Returns an array of Task objects.
			Returns an empty array if no results are returned from the server.

			Optionally, 'limit' will restrict the server to only return
			the first 'limit' tasks.  (i.e., passing a value of 500 for
			limit will return the 500 most recent tasks from the DB).
		*/

		var results = [];

		if( limit === undefined || limit === null ){
			limit = false; // if no value is passed in for limit, set limit to 'false'
		}

		var endpoint = '/tasks'; // TODO: this is not the confirmed enpoint, change this.

		// HTTP request is commented out until the server-side is set up.  Results of this function are MOCKED for now.
		/*
		$http({
			method: 'POST',
			url: endpoint,
			data: {
				limit: limit, // "false" for no limit
			},
		}).then(function(response){

			if( response ){ // if 'response' does not eval to some falsey value (like null or false or 0 etc.)

				// clear 'this.task_list', then:
				// use the JSON in 'response' to construct Task objects, and add them to 'this.task_list'

			}else{
				return false; // if there was something wrong with the response, return false to signify the request failed
			}
		});
		//*/

		var MOCK_VALUES = [
			new Task(1,"Pick Up Son From School", "I'm going to be at work late, can someone please pick my son up from junior high school?  Please don't hurt/maim/kill/steal him, he means a lot to me, even though I can't leave work early to pick him up.  Price includes gas money.", 65, "151 E 39th St, Reading, PA 19606", new Date().getTime(), 1, "Bad Parent", null, "", TASK_STATUS.active),
			new Task(3,"Tutor for Web Design", "I need someone who is willing to tutor me on the basics of web design, but more specifically, on the MVC format and AngularJS.  I can't seem to wrap my head around all of the different components!  Ideally, you'll have a lot of experience in the subject, especially because I'm willing to pay a lot per hour.  Price covers three hours, but you don't have to do all three.  Only serious inquiries please!!!", 120, "Rush Building, Drexel University", (new Date().getTime() + 2), 2, "Helpless Freshman", null, null, TASK_STATUS.active),
		];

		this.task_list = MOCK_VALUES;
	};


	this.addTask = function(title, desc, price, location, time, poster_id){

		// url: '/addtask'
		// method: 'POST'

		$http({ // wrap below stuff in "data" object
			method: 'POST',
			url: '/addtask',
			data: {
				title: title,
				description: desc,
				location: location,
				datetime: time,
				poster_id: poster_id,
				price: price,
				status: 0
			}
		}).then(function(response){

			if( response ){ // expects "true" on success

				// same idea as update task (below).  Just return true, and taskCard_ctrl will set edit mode to false

			}else{ // expects "false" on failure

				// alert the user that the task couldn't be added
			}
		});
	};


	this.updateTask = function(id, title, desc, price, location, time, poster_id, worker_id){

		$http({
			method: 'POST',
			url: '/updatetask',
			data: {
				taskid: id,
				title: title,
				description: desc,
				location: location,
				datetime: time,
				poster_id: poster_id,
				price: price,
				worker_id: worker_id,
				status: 0
			}
		}).then(function(response){

			if( response ){ // expects "true" on success

				// Now that the details are successfully changed, just return true.
				// The function that calls this (from the taskCard_ctrl) will just set edit mode back to false

			}else{ // expects "false" on failure

				// alert the user that the update failed
			}
		});
	};


	this.deleteTask = function(id){

		$http({ // url: '/deletetask' 'taskid'
			method: 'POST',
			url: '/deletetask',
			data: {
				taskid: id
			}
		}).then(function(response){

			if( response ){ // expects true on success

				// find the task in this.task_list by its id, and remove it

			}else{ // expects false on failure

				// give the user some message that the deletion failed
			}

		});
	};



}]);
