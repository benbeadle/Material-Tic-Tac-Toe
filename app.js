var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

//View (Jade) Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/api', api);


app.use('/', function(req, res, next) {
	res.redirect('/');
});

app.listen(3000, function() {
	console.log("Listening");
});