(function() {'use strict';

var aGameInjects = ['localStorageService'];
var GameFactory = function(localStorageService) {

	//The number of rows and columns.
	//For example, if this was 3, then the board would be: 3x3
	var iBoardSide = 3;

	var Game = function() {
		var self = this;

		//The status of the game. Should either be "setup" or "play"
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

	//Called for a player to make a move
	proto.move = function(tileIndex) {
		if(this.board[tileIndex] !== "") { return; }

		this.board[tileIndex] = this.currentPlayer["avatar"];

		//Toggle between 1 and 0
		var iPlayerIndex = (this.currentPlayerIndex + 1) % 2;
		this.currentPlayerIndex = iPlayerIndex;
		this.currentPlayer = this.players[iPlayerIndex === 0 ? "one" : "two"];
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

	return new Game();

};
GameFactory.$inject = aGameInjects;
angular.module('TicTacToeMaterial').factory('GAME', GameFactory);

})();