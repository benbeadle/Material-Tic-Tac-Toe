var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var io = require('./io.js');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

//To run socket.io, we need to use an http server. Express is still used,
//but now the server is started instead of starting Express directly.
var server = http.Server(app);


var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || "localhost";
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//View (Jade) Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Public static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api', api);
app.use('/', routes);

//Enable Websockets for remote games
io(server);

//Begin the server
server.listen(PORT, IP_ADDRESS, function() {
	var address = "http://" + IP_ADDRESS + ":" + PORT;
	console.log("Server running. Goto " + address + " in your browser.");
});