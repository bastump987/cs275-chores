// prinit auto-generated file
var app = angular.module('myapp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/', {
		templateUrl: 'templates/login.html',
		controller: 'login_ctrl',
		controllerAs: 'login'
	})
	$routeProvider.when('/dash', {
		templateUrl: 'templates/main.html',
		controller: 'main_ctrl',
		controllerAs: 'main'
	});
}]);


/*  JS Object Prototypes */


function Task(id, title, desc, price, location, time, poster_id, poster_name, worker_id, worker_name, status, timestamp){
	this.id          = id || null;          // the id of the task in the DB (primary key)
	this.title       = title || null;       // the heading of this posting
	this.desc        = desc || null;        // a description of what the worker needs to do to complete the task
	this.price       = price || 0;          // money that will be awarded to the worker upon completion
	this.location    = location || null;    // the place where the task takes place (if any)
	this.time        = time || null;        // the time at which the task should be done (if any)
	this.poster_id   = poster_id || null;   // the id (from the DB) of the user who posted this task
	this.poster_name = poster_name || null; // the full name (first&last) of the user who posted this task
	this.worker_id   = worker_id || null;   // the id (from the DB) of the user who will complete this task
	this.worker_name = worker_name || null; // the full name (first&last) of the user who will complete this task
	this.status      = status || null;      // a state from the 'TASK_STATUS' global object (enum), representing the current completion status of the task
	this.timestamp   = timestamp || null;   // the time the task was first created
}


function User(id, first, last, phone, email, username, balance){
	this.id        = id;       // the id (from the DB) of the user (primary key)
	this.first     = first;    // first name of user
	this.last      = last;     // last name of user
	this.phone     = phone;    // user's phone number
	this.email     = email;    // user's email
	this.username  = username; // username
	this.balance   = balance;  // the money the user has earned

	this.full_name = first + " " + last; // nice shortcut variable for displaying full name
}
