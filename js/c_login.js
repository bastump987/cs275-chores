app.controller('login_ctrl', ['$scope', '$window', '$timeout', 'user_svc', function($scope, $window, $timeout, user_svc){

	this.dash_url = "#/dash"; // redirect to this url when login is successful

	this.PANELS = {
		login: 0,
		register: 1
	};
	Object.freeze(this.PANELS);

	this.activePanel = this.PANELS.login;

	this.register_message = "To create an account, enter your info below and click 'Register'.";
	this.login_error      = "";

	// -- Fields for Login (lg)
	this.lg_username = "";
	this.lg_password = "";

	// -- Fields for Registration (rg)
	this.rg_name     = ""; // will be parsed to separate first/last
	this.rg_username = "";
	this.rg_email    = "";
	this.rg_password = "";
	this.rg_confirm  = "";
	this.rg_phone    = "";


	this.clearLgFields = function(){
		this.lg_username = "";
		this.lg_password = "";
	};

	this.clearRgFields = function(){
		this.rg_name    = "";
		this.rg_username = "";
		this.rg_email    = "";
		this.rg_password = "";
		this.rg_confirm  = "";
		this.rg_phone    = "";
	};

	this.isValidPhone = function(){

		// matches a legal US number, with OR without hyphenation
		var re = new RegExp(/^([2-9]\d{2}-\d{3}-\d{4}$)|([2-9]\d{9})$/);

		// for the phone number to be valid, it must be match the expression 're', AND be 10 or 12 characters long
		var results      = re.exec(this.rg_phone);
		var phone_length = this.rg_phone.length;

		if( results !== null && (phone_length == 10 || phone_length == 12) ){
			return true; // valid
		}else{
			return false;
		}

	};

	this.isValidPassword = function(){ // returns true if the "password" and "confirm password" fields are NOT blank, and match
		return ( (this.rg_password === this.rg_confirm) && (this.rg_password != "" && this.rg_confirm != "") );
	};

	this.loginTopbarClick = function(){
		this.clearLgFields();
		this.activePanel = this.PANELS.login;
	};

	this.registerTopbarClick = function(){
		this.clearRgFields();
		this.register_message = "To create an account, enter your info below and click 'Register'.";
		this.activePanel = this.PANELS.register;
	};

	this.registerClick = function(){

		var message = "";
		var ph      = this.isValidPhone();         // true if the phone number is valid
		var pw      = this.isValidPassword();      // true if the passwords are not blank and match
		var fr      = $scope.register_form.$valid; // true if the form state is valid

		if( ph && pw && fr ){ // if all details are valid ...

			// separate name into parts
			var name_parts = this.rg_name.split(' ');
			var first_name = name_parts[0];
			var last_name  = name_parts[1] || "";

			// attempt to register the user
			var result = user_svc.register(this.rg_username,
										   this.rg_password,
										   first_name,
										   last_name,
										   this.rg_email,
										   this.rg_phone);

			if( result === true ){ // on success, clear inputs and show success message

				this.register_message = "Registration successful!  You can now sign in.";
				this.clearRgFields();

			}else{ // on failure, show the error message from the server
				this.register_message = result;
			}
		}else{
			if( fr ){
				if( !ph ){ message = "Please use a valid phone number."; }
				if( !pw ){ message = "Passwords cannot be blank and must match."; }
				this.register_message = message;
			}
		}
	};

	this.loginClick = function(){

		var result = user_svc.authenticate(this.lg_username, this.lg_password);
		result = true; // DB get rid of this after testing

		if( result ){ // if login is successful ...
			$window.location.href = this.dash_url; // ... change url to the dashboard
		}else{

			// show an error message to the user
			this.login_error = "Login failed, invalid username or password.";

			// after 5 seconds of displaying the message, reset it
			$timeout(function(){
				this.login_error = "";
			}.bind(this), 5000);
		}
	};

}]);
