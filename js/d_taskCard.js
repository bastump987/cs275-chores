app.controller('taskCard_ctrl', ['$scope', 'user_svc', 'task_svc', function($scope, user_svc, task_svc){

	this.isActive     = false;
	this.isEditing    = false;
	this.showDelete   = false; // set by a $watch on user_svc.current_user.  True to show delete button

	this.pendingEdit  = {}; // will contain info on the pending edit of the task.  set to a copy of $scope.task when "edit" is clicked

	this.buttonAction = function(){}; // this function will be set by a $watcher
	this.button_text  = "";

	this.filterFunc   = function(){

		var w_id   = $scope.task.worker_id;
		var p_id   = $scope.task.poster_id;
		var u_id   = user_svc.current_user.id;
		var status = $scope.task.status;

		if( status > 1 ){

			if( w_id === u_id || p_id === u_id ){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	};


	this.toggleActive = function(){
		this.isActive = !this.isActive;
	};


	this.topareaClick = function(){

		if( !this.isEditing ){
			this.toggleActive();
		}
	};


	this.markDoneClick = function(){

		// do an AJAX request to the server to update the task
		// --> changes status to "pending" (3) if user_svc.current_user is the worker
		// --> changes status to "completed" (4) if user_svc.current_user is the poster

		var t = $scope.task; // shorthand

		var new_status = 0; // not a valid status
		var uid        = user_svc.current_user.id;
		if( uid === t.poster_id ){
			new_status = 4;
		}else if(uid === t.worker_id ){
			new_status = 3;
		}

		// callback for AJAX request
		var callback = function(data){

			// expects a row (representing a task) on success, and false on failure
			if( data !== false ){

				// update front-end (database will already be synced, only the status changed)
				$scope.task.status = new_status;
				if( new_status === 3 ){
					this.button_text  = "PENDING";
					this.buttonAction = function(){};
				}else if( new_status === 4 ){
					this.button_text  = "DONE";
					this.buttonAction = function(){};
				}
			}
		};

		// make the AJAX request
		task_svc.updateTask(t.id, t.title, t.desc, t.price, t.location, t.time, t.poster_id, t.worker_id, new_status, callback);
	};


	this.confirmClick = function(){

		// validate fields first
		// then make AJAX request to update task

		var valid = this.validateEdit();

		if( valid ){

			var callback = function(data){

				if( data === true ){

					$scope.task       = this.pendingEdit;

					this.pendingEdit  = {};
					this.isEditing    = false;

					this.button_text  = "EDIT";
					this.buttonAction = this.editClick;

				}else{

					this.isEditing   = false;
					this.pendingEdit = {};

					alert("Couldn't sync changes with the database.  Try again later.");
				}

			}.bind(this);

			var t = this.pendingEdit;
			task_svc.updateTask(t.id, t.title, t.desc, t.price, t.location, new Date(t.time), t.poster_id, t.worker_id, t.status, callback);

		}else{
			alert("Oops... \n\n All fields must be filled out, and be sure to look at the hints in the input fields for length or formatting requirements.");
		}

	};


	this.postClick = function(){

		var valid = this.validateEdit();

		if( valid ){

			var callback = function(data){

				this.pendingEdit.id     = data.insertId;
				this.pendingEdit.status = 1;

				// update the first task in task_list (this task)
				task_svc.task_list[0] = angular.copy(this.pendingEdit);

				this.pendingEdit  = {};
				this.isEditing    = false;
				this.isActive     = false;

				this.button_text  = "EDIT";
				this.buttonAction = this.editClick;

			}.bind(this);

			var t = this.pendingEdit;
			task_svc.addTask(t.title, t.desc, t.price, t.location, t.time, user_svc.current_user.id, callback);
		}else{
			alert("Oops... \n\n All fields must be filled out, and be sure to look at the hints in the input fields for length or formatting requirements.");
		}
	};


	this.acceptClick = function(){

		// make AJAX request to update task
		// following attributes are different:
		//  - worker_id: should be the current user's id
		//  - worker_name: should be the current user's name (can be set in the query if we want)
		//  - status: should be "accepted" (2)

		// upon a successful request, switch button state to "mark as done"

		var confirmation = confirm("Do you want to accept " + $scope.task.poster_name +"'s task, '" + $scope.task.title + "'?");
		if( confirmation ){

			var callback = function(data){

				if( data === true ){

					$scope.task.status    = 2; // set status to accepted
					$scope.task.worker_id = user_svc.current_user.id;

					this.button_text  = "MARK AS DONE";
					this.buttonAction = this.markDoneClick;

				}else{
					alert("ERROR: Couldn't accept task.");
				}
			}.bind(this);

			var t = $scope.task;
			task_svc.updateTask(t.id, t.title, t.desc, t.price, t.location, t.time, t.poster_id, user_svc.current_user.id, 2, callback);
		}
	};


	this.editClick = function(){

		// make a copy of $scope.task and store in this.pendingEdit (will be used as data model for making edits)
		this.makeEditCopy();

		// set state and update button text/action
		this.isEditing    = true;
		this.button_text  = "APPLY";
		this.buttonAction = this.confirmClick;
	};


	this.deleteClick = function(){

		if( $scope.task.id === null ){ // if the id is not a number, the task only exists on the front end, and can be deleted immediately

			var i = task_svc.task_list.indexOf( $scope.task );
			task_svc.task_list.splice(i, 1);

		}else{ // if the id is a number, the task exists on the database and we have to make an AJAX request to delete it

			var confirmation = confirm("Delete '" + $scope.task.title + "' from the task listings?");

			if( confirmation ){
				task_svc.deleteTask($scope.task.id, function(data){

					if( data === true ){
						var i = task_svc.task_list.indexOf( $scope.task );
						task_svc.task_list.splice(i, 1);
					}else{
						alert("Couldn't delete task.");
					}

				});
			}


		}

	};


	this.validateEdit = function(){

		/*
		New/Editing Task Validation, check the following:

		 - all fields must be filled out
		 - price cannot be negative
		 - title must be at least 8 characters and at most 40 characters
		 - description must be at least 20 characters and at most 460 characters
		 - time must be valid (parsed correctly by Date())
		*/

		// shorthand reference for pendingEdit (t for 'task')
		var t = this.pendingEdit;

		// All fields must be filled out
		var valid_filled = true;
		if( t.title === null || t.price === null || t.desc === null || t.location === null || t.time === null ){
			valid_filled = false;
		}

		// Price cannot be negative
		var valid_price = true;
		var price_num   = Number.parseInt( t.price );
		if( isNaN(price_num) || price_num < 0 ){
			valid_price = false;
		}

		// Title length must be >= 8 and <= 40
		var valid_title = true;
		if( t.title !== null && (t.title.length < 8 || t.title.length > 40) ){
			valid_title = false;
		}

		// Desc length must be >= 20 and <= 460
		var valid_desc = true;
		if( t.desc !== null && (t.desc.length < 20 || t.desc.length > 460) ){
			valid_desc = false;
		}

		// New Date object from Time string should be valid
		var valid_time = true;
		if( t.time !== null ){

			var d = new Date( t.time.toString() );
			if( isNaN(d.getTime()) ){
				valid_time = false;
			}
		}


		// check valid booleans
		return ( valid_filled && valid_price && valid_title && valid_desc && valid_time );


	};


	$scope.$watch(function(){ return user_svc.current_user; }, function(newValue, oldValue){

		var c_user = newValue;

		if( c_user.id === $scope.task.poster_id ){

			if( $scope.task.status < 2 ){ // if the task has NOT been accepted yet ...
				this.button_text  = "EDIT";
				this.buttonAction = this.editClick;
			}else if( $scope.task.status === 2 || $scope.task.status === 3 ){
				console.log("should be MARK AS DONE"); // DB
				this.button_text  = "MARK AS DONE";
				this.buttonAction = this.markDoneClick;
			}


		}else if( c_user.id === $scope.task.worker_id ){

			if( $scope.task.status === 2 ){
				this.button_text  = "MARK AS DONE";
				this.buttonAction = this.markDoneClick;
			}else if( $scope.task.status === 3 ){
				this.button_text  = "PENDING";
				this.buttonAction = function(){};
			}


		}else{

			// no need to handle anything else.  Accepted tasks will be hidden from non-participating users
			if( $scope.task.status < 2 ){
				this.button_text  = "ACCEPT TASK";
				this.buttonAction = this.acceptClick;
			}
		}


		if( c_user.id === $scope.task.poster_id && $scope.task.status < 2 ){
			this.showDelete = true;
		}else{
			this.showDelete = false;
		}

	}.bind(this));


	$scope.$watch(function(){ return this.isEditing; }.bind(this), function(newValue, oldValue){

		if( newValue === false && oldValue === false ){ // this happens when the task card is initialized
			this.makeEditCopy();
		}

	}.bind(this));


	$scope.$watch(function(){ return $scope.task.status; }, function(newValue, oldValue){

		if( newValue > 2 ){
			this.showDelete = false; // no task can be deleted once it has been accepted
		}

		if( newValue === 3 ){ // if status is "pending"

			// make button just show "PENDING", action is nothing
			if( user_svc.current_user.id !== $scope.task.poster_id ){
				this.button_text  = "PENDING";
				this.buttonAction = function(){};
			}
		}

		if( newValue === 4 ){
			this.button_text  = "DONE";
			this.buttonAction = function(){};
		}

	}.bind(this));


	$scope.$watch(function(){ return $scope.task.title; }, function(newValue, oldValue){

		if( newValue === null && oldValue === null ){

			if( $scope.task.poster_id === user_svc.current_user.id ){

				this.isActive     = true;
				this.isEditing    = true;
				this.button_text  = "POST";
				this.buttonAction = this.postClick;
			}
		}

	}.bind(this));


	this.makeEditCopy = function(){

		// Makes a copy of $scope.task for editing, and stores it in this.pendingEdit
		// All attributes remain unchanged, but the date is converted to a string form

		// make a copy of $scope.task
		var copy = angular.copy($scope.task);

		if( Date.prototype.isPrototypeOf(copy.time) ){

			// use the copy's "time" attribute to make a new date object
			var date = new Date(copy.time);

			// extract details from the new date object
			var day     = date.getDate().toString();
			var month   = (date.getMonth() + 1).toString();
			var year    = date.getFullYear().toString().substr(2);
			var hours   = date.getHours();
			var minutes = date.getMinutes();
			var suffix  = "";

			// convert hours from 24-hr format to AM/PM format
			if( hours > 12 ){
				hours -= 12;
				hours  = hours.toString();
				suffix = "PM";
			}else{
				suffix = "AM";
			}

			// pad the minutes with leading zero if necessary
			if( minutes < 10 ){
				minutes = "0" + minutes.toString();
			}else{
				minutes.toString();
			}

			// set copy's "time" attribute to the constructed date string (mm/dd/yy hh:mm)
			var datestr = month + "/" + day + "/" + year + " " + hours + ":" + minutes + " " + suffix;
			copy.time   = datestr;
		}


		// set this.pendingEdit to the copy
		this.pendingEdit = copy;

	};

}]);

app.directive('taskCard', [function(){

	return {
		restrict: 'E',
		scope: {
			task: '=' /* a reference to a Task object */
		},
		templateUrl: 'templates/taskCard.html',
		controller: 'taskCard_ctrl',
		controllerAs: 'ctrl'
	};

}]);
