var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

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

//Begin the server
app.listen(3000, function() {
	console.log("Server running. Goto http://localhost:3000 in your browser.");
});