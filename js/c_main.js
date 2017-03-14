app.controller('main_ctrl', ['$scope', 'task_svc', function($scope, task_svc){

	this.refreshTasks = function(){
		task_svc.getAllTasks();
	};
}]);
