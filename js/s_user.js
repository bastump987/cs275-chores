app.service('user_svc', ['$http', '$window', function($http, $window){

	this.current_user = false;
	this.posted       = 0;
	this.completed    = 0;

	this.authenticate = function(username, password, callback){

		// will make an ajax ($http) request to try and login with the given user credentials
		// the front-end will NOT hash the password, because the server-side expects a hashed password (which is what is saved in the DB)
		// therefore, the NodeJS will have to hash the password and *then* use the hashed value to query the database

		$http({
			method: 'POST',
			url: '/login',
			data: {
				username: username,
				password: password
			}
		}).then(function(response){

			if( response.data ){ // on success, some json representation of a User object will be returned

				this.current_user = new User(response.data[0].ID,
											 response.data[0].first_name,
											 response.data[0].last_name,
											 response.data[0].phone,
											 response.data[0].email,
											 response.data[0].username,
											 response.data[0].balance);

				callback( true );

			}else{
				callback( false ); // Return 'false', specifying to the controller that authentication failed
			}
		}.bind(this));
	};


	this.register = function(username, password, first_name, last_name, email, phone, callback){

		// will make an ajax ($http) request to attempt to create a new user account with the given parameters
		// will return 'true' on success, or an error message on false (saying which detail was wrong, (e.g. "Username is taken", "Account exists with that email")

		$http({
			method: 'POST',
			url: '/adduser',
			data: {
				username: username,
				password: password,
				first_name: first_name,
				last_name: last_name,
				email: email,
				phone: phone
			}
		}).then(function(response){

			// if the response is not "true", then it will be an error message, so return it to the front end
			// if it's true, the user is successfully registered

			callback( response );

		});
	};


	this.refreshUser = function(id){

		// after a page reload, this function updates the current_user field if a session still exists

		$http({
			method: 'POST',
			url: '/userdetails',
			data: {
				id: id
			}
		}).then(function(response){

			if( response.data ){
				var u = response.data[0];
				this.current_user = new User(u.ID, u.first_name, u.last_name, u.phone, u.email, u.username, u.balance);
			}
		}.bind(this));
	};


	this.logout = function(){

		this.current_user = false;
		sessionStorage.clear();

		$window.location.href = "/";
	};


	this.getTaskCounts = function(){

		if( this.current_user ){

			var id = this.current_user.id;

			$http({
				method: 'POST',
				url: '/taskcounts',
				data: {
					id: id
				}
			}).then(function(response){

				var counts     = response.data;

				var posted     = counts[0]["COUNT(title)"];
				var completed  = counts[1]["COUNT(title)"];

				this.posted    = posted;
				this.completed = completed;

				console.log(counts);

			}.bind(this));
		}
	};
}]);
