(function() {'use strict';

var aGameInjects = ['$http', '$q', 'localStorageService'];
var GameFactory = function($http, $q, localStorageService) {

	//The number of rows and columns.
	//For example, if this was 3, then the board would be: 3x3
	var iBoardSide = 3;

	var Game = function() {
		var self = this;

		//The status of the game. Should either be "setup", "play", "verify", or "complete"
		self.state = "setup";
		self.sideLength = iBoardSide;
		self.size = iBoardSide * iBoardSide;
		self.board = [];
		//This is the calculated lasses for the board tiles for borders
		self.boardClasses = {};

		//The players information
		self.players = {
			"one": {
				"name": localStorageService.get("player.one.name") || "",
				"avatar": localStorageService.get("player.one.avatar") || "close" // X
			},
			"two": {
				"name": localStorageService.get("player.two.name") || "",
				"avatar": localStorageService.get("player.two.avatar") || "checkbox-blank-circle-outline" // O
			}
		};

		//The current player index. Either 0 or 1
		self.currentPlayerIndex = 0;
		self.currentPlayer = self.players["one"];

		//Keep track of how many games have been played
		this.plays = 0;

		//Initialize the board
		createBoard(self);
	};

	var proto = Game.prototype;
	proto.constructor = Game;

	proto.isReady = function() {
		return isGameReadyToPlay(this);
	};

	proto.startGame = function() {
		if(isGameReadyToPlay(this)) {
			this.state = "play";
		}
	};

	//Create a new game and reset the board
	proto.playAgain = function() {
		//Reset the board
		this.state = "play";
		this.board = [];
		this.boardClasses = {};
		createBoard(this);

		//Toggle between players for who goes first.
		this.plays++;
		this.currentPlayerIndex = this.plays % 2;
		var sPlayerName = this.currentPlayerIndex === 0 ? "one" : "two";
		this.currentPlayer = this.players[sPlayerName];
	};

	//Called for a player to make a move
	//Return's the current player's index.
	proto.move = function(tileIndex) {
		if(this.board[tileIndex] !== "") { return; }

		this.board[tileIndex] = this.currentPlayer["avatar"];

		//Toggle between 1 and 0
		var iPlayerIndex = togglePlayer(this);
		this.currentPlayerIndex = iPlayerIndex;
		this.currentPlayer = this.players[iPlayerIndex === 0 ? "one" : "two"];

		return togglePlayer(this);
	};

	proto.checkWinner = function(iPlayerIndex, iTileIndex) {
		return checkForWinner(this, iPlayerIndex, iTileIndex);
	};

	//Check's the server to verify there's a winner
	function hasWinner(game, iWinnerIndex, aWinningTiles) {
		//Set's the current player to -1 since the game is over.
		game.state = "verify";
		//We are verifying the winner with the server.
		//The defer will be resolved with the winner or rejected if there
		//isn't a winner.
		var defer = $q.defer();

		var data = {
			"board": game.board,
			"side": game.sideLength,
			"winningTiles": aWinningTiles
		};

		$http.post('/api/winner', data).then(function(response) {

			//Check the winner by figuring out the avatar.
			var data = response.data || {};
			var bWinner = data["winner"] || false;
			if(bWinner) {
				var winner = new Winner(game, iWinnerIndex, aWinningTiles);

				//Make the game as complete
				game.state = "complete";
				game.currentPlayerIndex = -1;

				//Resolve the defer
				defer.resolve(winner);
				return;
			}

			game.state = "play";
			defer.reject(null);
		}, function(response) {
			game.state = "play";
			defer.reject(null);
		});

		return defer.promise;
	}

	//Returns the next player
	function togglePlayer(game) {
		return (game.currentPlayerIndex + 1) % 2;
	}

	function computeTileClass(game, index) {
		return {
			'border-right': ((index+1) % game.sideLength !== 0),
			'border-bottom': (game.size - index > game.sideLength)
		};
	};

	//Returns whether the game is ready to play
	function isGameReadyToPlay(game) {
		return (
			game.players["one"]["name"] !== "" &&
			game.players["two"]["name"] !== "" &&
			game.players["one"]["name"] !== game.players["two"]["name"]
		);
	}

	//Reset the board and set each spot to blank
	function createBoard(game) {
		game.board = [];
		for(var i = 0; i < game.size; i++) {
			game.board.push('');

			//Here, we compute board classes for the borders.
			//This is to compute once instead of inside ng-class.
			game.boardClasses[i] = computeTileClass(game, i);
		}
	}

	//Checks for a winner given the tile index just played.
	//Returns a Winner if there is or null.
	function checkForWinner(game, iPlayerIndex, index) {

		//Make sure the tile isn't blank
		if(game.board[index] === '') { return null; }

		/*
			The algorithm could be naive and brute force the board.
			Alternatively, if we know the tile that was just played, then
			it's safe to assume if there's a win, that tile must be in the
			winning line. Since,
				1) There's no way the other player could have won on this turn.
				2) There's no way this player could have won without this tile.
		*/


		var sWinningAvatar = game.board[index];
		//Calculate what it takes to win. If the board is 3x3, then you win
		//with 3 in a row. Else if it's higher, then it's 4 in a row.
		var iWinningLength = game.sideLength === 3 ? 3 : 4;


		//We check vertical, horizontal, diagonal back, and diagonal forward.
		for(var i = 1; i < 5; i++) {
			var winner = checkWinnerByDirection(game, sWinningAvatar,
												iWinningLength, iPlayerIndex,
												index, i);
			if(winner !== null) {
				return winner;
			}
		}

		//There's no winner, so let's check if the winner is Cat

		//If there is a blank space, then there are still moves
		for(var i = 0; i < game.board.length; i++) {
			if(game.board[i] === '') {
				return null;
			}
		}

		//We know there's no winner and there's no empty spaces,
		//so Cat is the winner.
		return hasWinner(game, -1, []);
	}

	//Checks if there's a winner in the given direction.
	//Returns a Winner or null.
	//index is the current index
	//direction is 1-4 for the corresponding direction given below.
	/*
		1 2 3
		4 5 6
		7 8 9

		1) Vertical: +- size
		2) Horizonal: +- 1
		3) Diagonal Back: +- (size + 1)
		4) Diagonal Forward: +- (size - 1)
	*/
	function checkWinnerByDirection(game, sWinningAvatar, iWinningLength, iPlayerIndex, index, direction) {
		var aWinningTiles = [index]; //We can tally the count at 1 for the tile

		//We need to calculate the index change for this direction
		var iTileDiff = 0;
		switch(direction) {
			case 1: iTileDiff = game.sideLength; break;
			case 2: iTileDiff = 1; break;
			case 3: iTileDiff = game.sideLength + 1; break;
			case 4: iTileDiff = game.sideLength - 1; break;
		}

		//Don't continue if we were given an invalid direction
		if(iTileDiff === 0) { return null; }

		//Returns the next index or -1 if the next index isn't valid.
		function getNextTile(i, direction, diff) {

			/*if(direction === 2) {
				var iMod = i % game.sideLength;
				if(iMod === 0) { return -1; }
				if(iMod === (game.sideLength - 1)) { return -1; }
			}*/

			var newIndex = i + diff;

			//Make sure it's not too low
			if(newIndex < 0) { return -1; }

			//Make sure it's not too high
			if(newIndex >= game.size) { return -1; }

			var iThisRow = Math.floor(i / game.sideLength);
			var iNewRow = Math.floor(newIndex / game.sideLength);
			var iChangeInRow = (direction === 2 ? 0 : 1);
			if(Math.abs(iThisRow - iNewRow) !== iChangeInRow) {
				return -1;
			}

			return newIndex;
		}

		var b = game.board;

		/*
			The algorithm works by first checking up/left and then
			down/right. It tallies the # of tiles in a row and when it
			sees there's a winning count, it knows it found a winner.
		*/

		//We first check up/left which is negative and then down/right which
		//is positive.
		for(var i = 0; i < 2; i++) {
			var iThisTileDiff = iTileDiff * (i == 0 ? -1 : 1);

			//Now we keep getting the next tile until there's no more negative
			//tiles. Once we find enough in a row for a win, we return it.
			var iNextTile = getNextTile(index, direction, iThisTileDiff);
			while(iNextTile != -1) {

				//If this next tile doesn't have a matching avatar, then
				//we can stop checking this direction, since there's no more
				//winning tiles this way.
				if(b[iNextTile] !== sWinningAvatar) {
					iNextTile = -1;
					break;
				}

				aWinningTiles.push(iNextTile);

				//If they won, then return the Winner
				if(aWinningTiles.length === iWinningLength) {
					return hasWinner(game, iPlayerIndex, aWinningTiles);
				}

				iNextTile = getNextTile(iNextTile, direction, iThisTileDiff);
			}
		}

		return null;
	}

	//Represents a Winner
	function Winner(game, iPlayerIndex, tiles) {
		this.index = iPlayerIndex;
		this.player = null;

		//The Winner could be Cat (-1), which is not a valid player.
		if(iPlayerIndex >= 0) {
			//Get the player based on their index. 0 -> one, 1 -> two
			this.player = game.players[iPlayerIndex === 0 ? "one" : "two"];
		}

		//Sort the tiles so they are always in order.
		tiles.sort(function(a, b) {
			return a - b;
		});
		this.tiles = tiles;

		return this;
	}

	return Game;

};
GameFactory.$inject = aGameInjects;
angular.module('TicTacToeMaterial').factory('GAME', GameFactory);

})();