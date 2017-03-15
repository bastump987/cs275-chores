app.service('user_svc', ['$http', function($http){

	this.current_user = false;

	this.authenticate = function(username, password){

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

			if( response ){ // on success, some json representation of a User object will be returned

				this.current_user = new User(response.id,
											 response.first_name,
											 response.last_name,
											 response.phone,
											 response.email,
											 response.username);

				return true;

			}else{
				return false; // Return 'false', specifying to the controller that authentication failed
			}
		});
	};


	this.register = function(username, password, first_name, last_name, email, phone){

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

			return response;
		});
	};
}]);
