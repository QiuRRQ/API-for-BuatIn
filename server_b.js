var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');

//port for bank_part2
var app2 = express();
var app3 = express();
var app4 = express();
//start connection database
//this is for .....dunno
/*var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bank_part1'
});*/

var connection2 = mysql.createPool({
	connectionLimit: 50,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bank_part2'
});

/*connection.connect( function(error){
	if (!!error) {
		console.log('error');
	} else {
		console.log('connected');
	}
});*/

//query bank_part2 here
app2.get('/', function(req, res){

	var username = req.query.username; //catch passing parameter fromclient
	var password = req.query.password;
	var lokasi = req.query.lokasi;

	if (lokasi == "b") {
		connection2.getConnection(function(error, tempCont){
			if (!!error) {
				connection2.release();
				console.log('error');
			}else{
				
				password = crypto.createHash('md5').update(password).digest("hex");
				tempCont.query("select * from user where username = '" + username + "' and password = '"+ password+"'", 
					function(error, rows, fields){
					tempCont.release();
					if (!!error) {
						console.log('query error');
					}else{
						//res.send(rows);//send to http plain
						console.log('sukses login user database bank_part2');
						res.json(rows);
					}
				});
			}
		});
	} else {
		//send curl to server a
		console.log('request ke server b');
		res.redirect('http://localhost:1337?username='+username+'&password='+password+'&lokasi='+lokasi);
	}
	
})


app3.get('/', function(req, res){

	var from = req.query.from; //catch passing parameter fromclient
	var to = req.query.to;
	var value = req.query.value;
	var info = req.query.info;

	connection2.getConnection(function(error, tempCont){
		if (!!error) {
			connection2.release();
			console.log('error');
		}else{
			console.log('sukses on port 8080 database bank_part2');
			
			tempCont.query("INSERT INTO transaksi (`from`, `to`, `value`) VALUES ('"+from+"', '"+to+"', '"+value+"')", 
				function(error, rows, fields){
				tempCont.release();
				if (!!error) {
					console.log('query error');
				}else{
					//res.send(rows);//send to http plain
					res.send('sukses');
				}
			});
		}
	});
})

app4.get('/', function(req, res){

	var norek = req.query.norek; //catch passing parameter fromclient
	var info = req.query.info;

	if (info == "2") {
		connection2.getConnection(function(error, tempCont){
			if (!!error) {
				connection2.release();
				console.log('error');
			}else{
				console.log('sukses on port  database bank_part2');
				tempCont.query("select `from`, `to`, `date`, `value` from transaksi where `from` = '" + norek + "'"+" or `to` = '"+norek+"'", 
					function(error, rows, fields){
					tempCont.release();
					if (!!error) {
						console.log('query error');
					}else{
						//res.send(rows);//send to http plain
						res.json(rows);
					}
				});
			}
		});
	} else {
		//send curl to server a
		res.redirect('http://localhost:1339?norek='+norek+'&info='+info);
	}
	
})

app2.listen(8080);
app3.listen(7070);
app4.listen(6060);