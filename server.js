var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('mysql');
var session = require('client-sessions');


var time_format=require('moment');

var time_now=time_format();

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
	password: '15sept1997',
	database: 'cs275_project'
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
	var username=req.data.username;
	var pass=req.data.password;

	// try login after hasing the password.
	var quere=`select * from users where username=${username} AND password = PASSWORD(${pass})`;
	console.log()
	con.query(quere, function(err, rows, fields){
		if (err){
			res.send("Sorry! cconnection to database failed.")
		}
		else{
			if (rows.length==1){
				res.send(rows);
			}
			else{
				res.send("false");
			}
		}
	});
});


app.post('/addtask', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	var title=req.data.title;
	var desc=req.data.description;
	var loc=req.data.location;
	var datetime=req.data.datetime;
	var posterID=req.data.poster_id;
	var status = req.data.status;
	var price = req.data.price;
	var t=time_now.format('YYYY-MM-DD HH:mm:ss');
	console.log(t);
	query=`INSERT into tasks (title, description, location, datetime, poster_id, worker_id, status, price, posted_date_time) VALUES (${title},${desc}, ${loc}, ${datetime}, ${posterID}, NULL, ${status}, ${price}, ${t});`;
	console.log(query);

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for add task");
		}
		else{
			// return true on success and false on fail
			res.send(rows);
		}
	});

});

app.post('/updatetask', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	var id_task= req.data.taskid;
	var title=req.data.title;
	var desc=req.data.description;
	var loc=req.data.location;
	var datetime=req.data.datetime;
	var posterID=req.data.poster_id;
	var workerID = req.data.worker_id; // if null then make it a null in database
	var status = req.data.status;
	var price = req.data.price;

	query=`update tasks set worker_id=${workerID},location=${location},title=${title},description=${desc},datetime=${datetime},poster_id=${posterID}, status=${status}, price=${price}  where ID=${id_task};`;
	console.log(query);

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Quesry Failed for add task");
		}
		else{
			// return true on success and false on fail
			res.send(rows);
		}
	});

});

app.post('/adduser', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	var fname=req.data.first_name;
	var lname=req.data.last_name;
	var phone=req.data.phone;
	var email=req.data.email;
	var username= req.data.username;
	var password = req.data.password;
	// hash the password here
	query=`INSERT INTO Users (first_name, last_name, phone, email, username, password) VALUES (${fname}, ${lname}, ${phone}, ${email}, ${username}, PASSWORD(${password}) );`;
	console.log(query);

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for add User");
		}
		else{
			res.send(rows);
		}
	});
});

app.post('/deletetask', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	
	var id_task = req.data.taskid;
	query=`delete from tasks where ID=${id_task}`;
	console.log(query);
	if (id_task==null){
		res.send("No ID found!");
		return;
	}

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Query Failed for add task");
		}
		else{
			// return true if success and false if fail
			res.send(rows);
		}
	});
});

app.post('/tasks', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	// var d_limit=req.data.limit;
	// if (limit==false){
	// 	// do nothing  else limit the query.
	// }

	query="select * from tasks order by posted_date_time desc;";
	console.log(query);

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