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

var TASK_STATUS = {
	created:   0, // the initial state of a task, set right after its creation on the client-side.
	active:    1, // the state when a task is visible to other users.  Should probably be set by the server-side right before adding to the database for the first time.
	accepted:  2, // the state when someone has clicked "accept" on a task.  Will be set by the server side when request from "Accept" button is valid.  Accepted tasks will only be shown to the worker and the poster.
	completed: 3  // the state when a task is marked as "done" by the worker.  Will be set by the server side when either the poster or the worker clicks "Mark Complete" button (or something like that)
};
Object.freeze(TASK_STATUS); // makes the 'TASK_STATUS' global object (and its properties) immutable


function Task(id, title, desc, price, location, time, poster_id, poster_name, worker_id, worker_name, status){
	this.id          = id;          // the id of the task in the DB (primary key)
	this.title       = title;       // the heading of this posting
	this.desc        = desc;        // a description of what the worker needs to do to complete the task
	this.price       = price;       // money that will be awarded to the worker upon completion
	this.location    = location;    // the place where the task takes place (if any)
	this.time        = time;        // the time at which the task should be done (if any)
	this.poster_id   = poster_id;   // the id (from the DB) of the user who posted this task
	this.poster_name = poster_name; // the full name (first&last) of the user who posted this task
	this.worker_id   = worker_id;   // the id (from the DB) of the user who will complete this task
	this.worker_name = worker_name; // the full name (first&last) of the user who will complete this task
	this.status      = status;      // a state from the 'TASK_STATUS' global object (enum), representing the current completion status of the task
}


function User(id, first, last, phone, email, username){
	this.id        = id;       // the id (from the DB) of the user (primary key)
	this.first     = first;    // first name of user
	this.last      = last;     // last name of user
	this.phone     = phone;    // user's phone number
	this.email     = email;    // user's email
	this.username  = username; // username

	this.full_name = first + " " + last; // nice shortcut variable for displaying full name
}
