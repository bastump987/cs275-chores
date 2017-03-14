var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var mysql = require('mysql');

app.use(express.static("."));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

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




app.post('/addtask', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	var title=req.data.title;
	var desc=req.data.description;
	var loc=req.data.location;
	var datetime=req.data.datetime;
	var posterID=req.data.poster_id;
	//var workerID = req.data.worker_id; 
	var status = req.data.status;
	var price = req.data.price;
	// make worker id null
	query="";
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

	query="";
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
	query="";
	console.log(query);

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Quesry Failed for add task");
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
	var d_limit=req.data.limit;
	if (limit==false){
		// do nothing  else limit the query.
	}
	query="select * from tasks;";
	console.log(query);

	con.query(query, function(err, rows, fields){
		if (err){
			console.log("Quesry Failed for add task");
		}
		else{
			res.send(rows);
		}
	});
});


app.listen(8080,function(){
	console.log('Server Running…');
});