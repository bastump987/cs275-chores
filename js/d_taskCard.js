app.controller('taskCard_ctrl', ['$scope', function($scope){

	this.isActive = true;

	this.isEditing = false;

	this.buttonAction = function(){}; // this function will be set by a $watcher

	this.button_text = "";

	this.toggleEdit = function(){
		this.isEditing = !this.isEditing;
	};

	this.toggleActive = function(){
		this.isActive = !this.isActive;
	};


	$scope.$watch(function(){ return this.isEditing; }.bind(this), function(newValue, oldValue){

		if( newValue === false && oldValue === false ){
			this.button_text = "EDIT";
			this.buttonAction = this.toggleEdit;
		}

		if( newValue !== oldValue ){

			if( newValue ){ // when we begin making edits
				this.button_text  = "CONFIRM CHANGES";
				this.buttonAction = this.toggleEdit;
			}else{ // when we change from editing to "done"
				this.button_text  = "EDIT";
				this.buttonAction = this.toggleEdit;
			}
		}
	}.bind(this));

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
