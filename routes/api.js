var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send({
  		"Hello": "World!"
  });
});

//Catch-all to return a 404
router.get('*', function(req, res, next) {
	res.status(404);
	res.send({
		"error": "Resource Not Found"
	});
});

module.exports = router;
