var express = require('express');
var router = express.Router();

router.post('/winner', function(req, res, next) {

	//Make sure all data is there.
	var aRequired = ["board", "side", "winningTiles"];
	for(var i = 0; i < aRequired.length; i++) {
		if(!(aRequired[i] in req.body)) {
			res.send({
				"error": aRequired[i] + " not found."
			});
			return;
		}
	}

	//Get the board and side size
	var aBoard = req.body["board"];
	var iSideLength = req.body["side"];
	var aWinningTiles = req.body["winningTiles"];

	//Make sure the length of the board matches
	if(aBoard.length != (iSideLength * iSideLength)) {
		res.send({
			"error": "Invalid board size."
		});
		return;
	}

	//If there are no winning tiles, then it means it's a draw.
	if(aWinningTiles.length == 0) {
		var bWinner = true;

		//Make sure all spaces are filled.
		for(var i = 0; i < aBoard.length; i++) {
			if(aBoard[i] == '') {
				bWinner = false;
				break;
			}
		}

		res.send({
			"winner": bWinner
		});
		return;
	}

	var sWinningValue = "";
	for(var i = 0; i < aWinningTiles.length; i++) {
		//Ensure the first winning tile is in range.
		if(aBoard.length <= aWinningTiles[i]) {
			res.send({
				"error": "Invalid winning tiles."
			});
			return;
		}

		//Ensure the tile isn't blank.
		var tileVal = aBoard[aWinningTiles[i]];
		if(tileVal == "") {
			res.send({
				"error": "Invalid winning tiles."
			});
			return;
		}

		//On first tile, just set the value
		//else just make sure it matches
		if(sWinningValue == "") {
			sWinningValue = tileVal;
		} else if(sWinningValue != tileVal) {
			res.send({
				"winner": false
			});
			return;
		}
	}

	res.send({
		"winner": true
	});
	return;
});

//Catch-all to return a 404
router.get('*', function(req, res, next) {
	res.status(404);
	res.send({
		"error": "Resource Not Found"
	});
});

module.exports = router;
