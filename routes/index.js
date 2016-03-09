var express = require('express');
var router = express.Router();

//The index page
router.get('/', function(req, res, next) {
  res.render('index');
});

//Catch-all to redirect to index page
router.get('*', function(req, res, next) {
  res.redirect(301, '/');
});

module.exports = router;
