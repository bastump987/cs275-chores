app.service('task_svc', ['$http', 'user_svc', function($http, user_svc){

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

		$http({
			method: 'POST',
			url: '/tasks',
			data: {
				limit: limit, // "false" for no limit
			},
		}).then(function(response){

			if( response.data ){ // if 'response.data' does not eval to some falsey value (like null or false or 0 etc.)

				// clear 'this.task_list', then:
				// use the JSON in 'response' to construct Task objects, and add them to 'this.task_list'

				var results = response.data;

				for( var i=0; i<results.length; i++){
					var c         = results[i];
					var id        = c.id;
					var title     = c.title;
					var desc      = c.description;
					var price     = c.price;
					var loc       = c.location;
					var time      = new Date( c.datetime );
					var p_id      = c.poster_id;
					var p_name    = c.first_name + " " + c.last_name;
					var w_id      = c.worker_id;
					var status    = this.statusToNum( c.status );
					var timestamp = new Date( c.posted_date_time );
					var w_name    = ""; // not used anyway

					var t = new Task(id, title, desc, price, loc, time, p_id, p_name, w_id, w_name, status, timestamp);

					this.task_list.push( t );
				}

			}
		}.bind(this));


		/*
		var MOCK_VALUES = [
			new Task(1,"Pick Up Son From School", "I'm going to be at work late, can someone please pick my son up from junior high school?  Please don't hurt/maim/kill/steal him, he means a lot to me, even though I can't leave work early to pick him up.  Price includes gas money.", 65, "151 E 39th St, Reading, PA 19606", new Date(), 9, "Bad Parent", null, "", TASK_STATUS.active),
			new Task(3,"Tutor for Web Design", "I need someone who is willing to tutor me on the basics of web design, but more specifically, on the MVC format and AngularJS.  I can't seem to wrap my head around all of the different components!  Ideally, you'll have a lot of experience in the subject, especially because I'm willing to pay a lot per hour.  Price covers three hours, but you don't have to do all three.  Only serious inquiries please!!!", 120, "Rush Building, Drexel University", new Date(), 2, "Helpless Freshman", null, null, TASK_STATUS.active),
		];

		// only keep this line when mocking data
		if( this.task_list.length <= 0 ){ this.task_list = MOCK_VALUES; }
		//*/

	};


	this.addTask = function(title, desc, price, location, time, poster_id, callback){

		var time_str  = this.dateToDBFormat( new Date(time) );
		var price_num = Number.parseInt( price );

		$http({
			method: 'POST',
			url: '/addtask',
			data: {
				title: title,
				description: desc,
				location: location,
				datetime: time_str,
				poster_id: poster_id,
				price: price_num,
				status: 1
			}
		}).then(function(response){

			// expects the task on success
			// expects "false" on failure

			if( response.data !== false ){
				user_svc.posted++;
			}
			callback(response.data);

		});
	};


	this.updateTask = function(id, title, desc, price, location, time, poster_id, worker_id, status, callback){

		var datetime = this.dateToDBFormat( time );

		$http({
			method: 'POST',
			url: '/updatetask',
			data: {
				taskid: id,
				title: title,
				description: desc,
				location: location,
				datetime: datetime,
				poster_id: poster_id,
				price: price,
				worker_id: worker_id,
				status: status
			}
		}).then(function(response){

			// expects to have true returned on success
			// expects false on failure

			callback(response.data);

		});
	};


	this.deleteTask = function(id, callback){

		$http({ // url: '/deletetask' 'taskid'
			method: 'POST',
			url: '/deletetask',
			data: {
				taskid: id
			}
		}).then(function(response){

			// expects true on success
			// expects false on failure

			if( response.data !== false ){
				user_svc.posted -= 1;
			}
			callback(response.data);

		});
	};


	this.dateToDBFormat = function(date){

		// takes a JavaScript Date object and converts it to the format expected by the database, which is:
		// 'YYYY-MM-DD HH:MM:SS'

		var date_str = "";

		// extract details from date object
		var year     = date.getFullYear().toString();
		var month    = (date.getMonth() + 1)
		var day      = date.getDate();
		var hours    = date.getHours();
		var minutes  = date.getMinutes();
		var seconds  = date.getSeconds();

		// pad the fields with leading zeroes if necessary
		if( month   < 10 ){ month   = "0" + month.toString();   }else{ month.toString();   }
		if( day     < 10 ){ day     = "0" + day.toString();     }else{ day.toString();     }
		if( hours   < 10 ){ hours   = "0" + hours.toString();   }else{ hours.toString();   }
		if( minutes < 10 ){ minutes = "0" + minutes.toString(); }else{ minutes.toString(); }
		if( seconds < 10 ){ seconds = "0" + seconds.toString(); }else{ seconds.toString(); }

		// construct date string
		date_str = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

		// return YYYY-MM-DD HH:MM:SS formatted date string
		return date_str;
	};


	this.statusToNum = function(status){

		switch( status  ){

			case "created":
				return 1;

			case "accepted":
				return 2;

			case "pending":
				return 3;

			case "completed":
				return 4;

		}
	};



}]);
