app.controller('tasks_ctrl', ['$scope', 'task_svc', function($scope, task_svc){

	this.task_list = [];

	$scope.$watch(function(){ return task_svc.task_list; }, function(newValue){ // watcher to update this controller's reference of task_svc.task_list when it changes
		this.task_list = newValue;
	}.bind(this));
}]);
