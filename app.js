var http = require('http');
var util = require('util');
var fs 	 = require('fs');
var mysql = require('mysql');

var DEBUG					= true;
var SERVER_LISTEN_PORT		= 3000;
var SERVER_LISTEN_PORT_TWO 	= 3001;

var unixWordsFilePath 		= "words";	// for my pc
// var unixWordsFilePath 		= "/usr/share/dict/words";
var wordsFilePath			= 'hangmanWordList.txt';

var saveDataMethod 			= 'file';	// user data saved to: database ('db') or 'file'
var userDataFolderPath		= "userData/";
// game variables
var wordListLength			= 0;

var connection = '';

// Connect to MySQL Database 
// --------------
function connectToDB(callback){
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'shoohangman'
	});

	connection.connect(function(err) {
	  if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	  }
	  console.log('connected as id ' + connection.threadId);
	  callback();
	});
}

function closeConnDB(){
	connection.end();
}

// Express server setup
//--------------------
// var express = require('express');
// app = express();
// var bodyParser = require('body-parser');

// app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json());

// // Socket.io
// //----------------------
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

function init(){
	var express = require('express');
	// var app = express();
	var app = express();
	// app.use(express.static(__dirname + '/public'));
	// var io = require('socket.io')(http);

	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	app.use(express.static(process.cwd() + '/public'));

	app.get('/hey/:idd?/:other?', function (req, res) {
		console.log("hey/id?");
		console.log('id: ' + req.params.idd)
		console.log('other: ' + req.params.other)
		res.send('Hello World dude')
	})

	app.delete('/', function (req, res) {
		console.log("this is a PUT request");
	});

	app.post('/', function (req, res) {
		console.log("this is a POST request");
	});

	server.listen(3000);

	// console.log(io);

	// io.on('connection', function(socket){
	// 	console.log("socket:");
	// 	console.log(socket.id);
	// 	var socketid = socket.id;
	// 	// var address = socket.handshake.address;
	//     // console.log("New connection from " + address.address + ":" + address.port);

	//   socket.on('chat message', function(msg){
	//     io.emit('chat message', msg);
	//     if (io.sockets.connected[socketid]) {
	//     	io.sockets.connected[socketid].emit('chat message', 'for your eyes only');
	// 	}
	//   });
	// });

	io.on('connection', function (socket) {
		console.log(socket.id);
		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
	    console.log(data);
	  });
	});

	// app.use(function (req, res, next) {
	// 	console.log("syp");
	// });

	// var server = app.listen(3000, function () {

	//   var host = server.address().address;
	//   var port = server.address().port;

	//   console.log('Example app listening at http://%s:%s', host, port)
	// })
}

function init2(){

	var express = require('express');
	// var app = express();
	var app = express();
	// app.use(express.static(__dirname + '/public'));
	// var io = require('socket.io')(http);

	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	server.listen(3000);

	// app.get('/', function (req, res) {
	//   res.sendfile(__dirname + '/index.html');
	// });
	app.use(express.static(process.cwd() + '/public'));

	io.on('connection', function (socket) {
	  socket.emit('news', { hello: 'world' });
	  socket.on('my other event', function (data) {
	    console.log(data);
	  });
	});
}

init();

exports.egg = {"hello": 5};

var abc = require("./two.js");