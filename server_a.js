var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');


//port for bank_part1
var app = express();
var app5 = express();
var app6 = express();


//this is for .....dunno
/*var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bank_part1'
});*/

var connection = mysql.createPool({
	connectionLimit: 50,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bank_part1'
});


/*connection.connect( function(error){
	if (!!error) {
		console.log('error');
	} else {
		console.log('connected');
	}
});*/

//start query here
app.get('/', function(req, res){ //req = rquest, res = response

	//this is for... dunno
	/*connection.query("select * from transaksi", function(error, rows, fields){ //rows = query result
		if (!!error) {
			console.log('error di query');
		}else{
			console.log('query sukses');
			console.log(rows[0].from);
			res.send('respon' + rows[0].from); //send response to http
		}
	});*/
	var username = req.query.username; //catch passing parameter fromclient
	var password = req.query.password;
	var lokasi = req.query.lokasi;
	if (lokasi == "a") {
		connection.getConnection(function(error, tempCont){
			if (!!error) {
				connection.release();
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
						res.json(rows);
						//res.send('login sukses');
						console.log('sukses login user database bank_part1');
						
					}
				});
			}
		});
	} else {
		console.log('request ke server b');
		res.redirect('http://localhost:8080?username='+username+'&password='+password+'&lokasi='+lokasi); // redirect to another server
		//dan itu menyingkat sekian baris dibawah LOL.

		/*request('http://localhost:8080?username='+username+'&password='+password+'&lokasi='+lokasi, (err, response, body) => {
		  if (err) { return console.log(err); }
		  //console.log(res.username);
		  console.log(response);
		  console.log(response.body.username);
		  res.json(JSON.stringify(response));
		});*/
		
		/*const options = {
		  method: 'GET',
		  uri: 'http://localhost:8080?',
		  qs: {
		    username: username,
		    password: password,
		    lokasi: lokasi
		  }
		}
		
		rpautoParse(options)
		    .then((data) => {
		      console.log("User Name:", data.username)
			  console.log("norek:", data.norek)
			  console.log("Password:", data.password)
			  console.log(data)
		      console.log("dapat respone")
		    })
		    .catch((err) => {
		      console.log(err)
		      res.render('error')
		    });*/
	}
})

app5.get('/', function(req, res){

	var from = req.query.from; //catch passing parameter fromclient
	var to = req.query.to;
	var value = req.query.value;
	var info = req.query.info;

	connection.getConnection(function(error, tempCont){
		if (!!error) {
			connection.release();
			console.log('error');
		}else{
			console.log('sukses on port 8080 database bank_part1');

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

app6.get('/', function(req, res){

	var norek = req.query.norek; //catch passing parameter fromclient
	var info = req.query.info;

	if (info == "1") {
		connection.getConnection(function(error, tempCont){
			if (!!error) {
				connection.release();
				console.log('error');
			}else{
				console.log('sukses on port 8080 database bank_part1');
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
		//send curl to server b
		res.redirect('http://localhost:6060?norek='+norek+'&info='+info);
	}
	
})

//query bank_part2 here

app.listen(1337);
app5.listen(1338);
app6.listen(1339);