var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('mysql');
var session = require('client-sessions');


var time_format=require('moment');

var time_now=time_format();

function dateToDBFormat(date){
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
}

app.use(express.static("."));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
	cookieName: 'session',
	secret: 'asdfasdf23423', //we could load all this in from an external file
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

var con=mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '@4207pulse2581',
	database: 'cs275db'
});
con.connect(function(err){
	if (err){
		console.log("Connection with db failed"+err);
	}else{
		console.log("Database successfully connected");
	}

});

app.get('/logout', function (req, res){
	req.session.reset();
	req.session.msg = 'You logged out';
	res.send('');
});

app.post('/login', function(req, res){
	var username=req.body.username;
	var pass=req.body.password;

	// try login after hasing the password.
	//var quere=`select * from users where username=${username} AND password = PASSWORD(${pass})`;
	var quere = "SELECT * FROM users WHERE username='" + username + "' AND password=PASSWORD('" + pass + "');";

	con.query(quere, function(err, rows, fields){
		if (err){
			res.send(err);
		}
		else{
			if (rows.length==1){
				res.send(rows);
			}
			else{
				res.send(false);
			}
		}
	});
});


app.post('/userdetails', function(req, res){

	res.header("Access-Control-Allow-Origin", "*");

	var id = req.body.id;

	var query = "SELECT * FROM users WHERE id=" + id.toString() + ";";
	con.query(query, function(error, rows, fields){

		if( error ){
			console.log(error);
			res.send(false);
		}else{
			res.send(rows);
		}
	});
});


app.post('/names', function(req, res){

	res.header("Access-Control-Allow-Origin", "*");

	var poster_id = req.body.poster_id;
	var worker_id = req.body.worker_id;

	var query = "SELECT ";

	if( poster_id !== null || poster_id !== undefined ){
		query += "(SELECT first_name FROM users WHERE id=" + poster_id + ") AS poster";
	}

	if( worker_id !== null || worker_id !== undefined ){

		if( query.length > 7 ){
			query += ", ";
		}
		query += "(SELECT first_name FROM users WHERE id=" + worker_id + ") AS worker";
	}

	query += ";";

	con.query(query, function(error, rows, fields){

		if( error ){
			console.log(error);
			res.send(false);
		}else{
			res.send(rows);
		}
	});
});


app.post('/taskcounts', function(req, res){

	res.header("Access-Control-Allow-Origin", "*");

	var id = req.body.id.toString();

	var query = "SELECT COUNT(title) AS posted FROM tasks WHERE poster_id=" + id + " ";
	query    += "UNION ALL ";
	query    += "SELECT COUNT(title) FROM tasks WHERE worker_id=" + id + " AND status='completed';";

	con.query(query, function(error, rows, fields){

		if( error ){
			console.log(error);
			res.send(false);
		}else{
			res.send(rows);
		}
	});
});


app.post('/addtask', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	var title=req.body.title;
	var desc=req.body.description;
	var loc=req.body.location;
	var datetime=req.body.datetime;
	var posterID=req.body.poster_id;
	var status = req.body.status;
	var price = req.body.price;
	var t=dateToDBFormat( new Date() );

	var query=`INSERT into tasks (title, description, location, datetime, poster_id, worker_id, status, price, posted_date_time) VALUES (\'${title}\',\'${desc}\', \'${loc}\', \'${datetime}\', ${posterID}, NULL, ${status}, ${price}, \'${t}\');`;

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for add task");
			res.send(false);
		}
		else{
			// return true on success and false on fail
			res.send(rows);
		}
	});

});

app.post('/updatetask', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	var id_task= req.body.taskid;
	var title=req.body.title;
	var desc=req.body.description;
	var loc=req.body.location;
	var datetime=req.body.datetime;
	var posterID=req.body.poster_id;
	var workerID = req.body.worker_id; // if null then make it a null in database
	var status = req.body.status;
	var price = req.body.price;

	var query=`update tasks set worker_id=${workerID},location=\'${loc}\',title=\'${title}\',description=\'${desc}\',datetime=\'${datetime}\',poster_id=${posterID}, status=${status}, price=${price}  where ID=${id_task};`;

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Quesry Failed for add task");
			res.send(false);
		}
		else{

			if( status === 4 ){
				con.query("UPDATE users SET balance = balance + " + price + " WHERE id=" + workerID + ";", function(error, rows, fields){

					if( error ){
						console.log(error);
					}
				});
			}

			res.send(true);
		}
	});

});

app.post('/adduser', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	var fname=req.body.first_name;
	var lname=req.body.last_name;
	var phone=req.body.phone;
	var email=req.body.email;
	var username= req.body.username;
	var password = req.body.password;
	// hash the password here
	var query=`INSERT INTO users (first_name, last_name, phone, email, username, password) VALUES (\'${fname}\', \'${lname}\', ${phone}, \'${email}\', \'${username}\', PASSWORD(\'${password}\') );`;

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for add User");
			res.send(err);
		}
		else{
			res.send(true);
		}
	});
});

app.post('/deletetask', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");

	var id_task = req.body.taskid;
	var query=`delete from tasks where ID=${id_task}`;
	if (id_task==null){
		console.log("No ID found!");
		res.send(false);
	}

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for add task");
			res.send(false);
		}
		else{
			// return true if success and false if fail
			res.send(true);
		}
	});
});

app.post('/tasks', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	// var d_limit=req.data.limit;
	// if (limit==false){
	// 	// do nothing  else limit the query.
	// }

	var query="select tasks.id, tasks.title, tasks.description, tasks.price, tasks.location, tasks.datetime, tasks.posted_date_time, tasks.status, tasks.poster_id, tasks.worker_id, users.first_name, users.last_name from tasks, users WHERE users.id=tasks.poster_id ORDER BY posted_date_time desc;";

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for get all tasks");
		}
		else{
			res.send(rows);
		}
	});
});

//GRANT ALL ON cs275_project.* TO brianuser@'2601:47:4000:1062:6db0:1a73:95c4:113a' IDENTIFIED BY 'mypass123';
//update tasks set worker_id=1,location='location example',title='title',description='description example',datetime="datetime var",poster_id=2, status=2, price=20  where ID=1;
app.listen(8080,function(){
	console.log('Server Running…');
});
