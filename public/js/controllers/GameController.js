(function() {'use strict';

var aGameInjects = ['$scope', '$timeout', 'GAME', 'localStorageService'];
var GameController = function($scope, $timeout, GAME, localStorageService) {

	//The list of possible avatars for players to choose from.
	var POSSIBLE_AVATARS = [
		'close', 'checkbox-blank-circle-outline', //X and O
		'android', 'apple', 'clippy', //tech
		'cat', 'cow', 'duck', 'ghost', 'owl', 'panda', 'paw', 'pig', //animals
		'bowling', 'football', 'pokeball', 'tennis', //sports
		'brightness-5', 'emoticon-poop', 'music-note', 'star' //objects
	];


	//The GAME service we make available to the scope for easy access.
	$scope.GAME = GAME;

	//The list of avatars for the menu.
	//The menu list does NOT include selected player's avatars. Since X and O
	//are the first two items, we just splice the array to start.
	$scope.avatarList = availableAvatars();

	//The GAME service fetches names and avatars to local storage.
	//This is a check to make sure the player's avatars didn't end up
	//being the same. If they were, we set player two's avatar to the next one.
	if(GAME.players["one"]["avatar"] === GAME.players["two"]["avatar"]) {
		var sNextAvatar = getNextAvatar(GAME.players["two"]["avatar"]);
		GAME.players["two"]["avatar"] = sNextAvatar;
		localStorageService.set('player.two.avatar', sNextAvatar);
	}

	//Listen to key up events on the player name fields so when they hit
	//enter, the game begins if ready.
	$scope.nameKeyUp = function(player, name, ev) {

		//Save the name to local storage
		localStorageService.set('player.' + player + '.name', name);

		//The keycode for enter is 13
		if(ev.keyCode !== 13) { return; }

		//Make sure both players have a name
		if(!GAME.isReady()) {
			return;
		}

		GAME.startGame();
	};

	$scope.startGame = function() {
		GAME.startGame();
		console.log(GAME.state);
	};


	//Called when they want to change their avatar.
	$scope.changeAvatar = function(player, avatar, ev) {
		//Make sure the avatar is different.
		if(GAME.players[player]["avatar"] === avatar) { return; }

		//Set their new avatar
		GAME.players[player]["avatar"] = avatar;
		localStorageService.set('player.' + player + '.avatar', avatar);

		//If the other player's avatar is this avatar, then change it.
		//This shouldn't happen since avatarList doesn't include selected
		//avatars - but just in case.
		var sOtherPlayer = (player === "one" ? "two" : "one");
		if(GAME.players[sOtherPlayer]["avatar"] === avatar) {
			//Select this avatar for the other player
			GAME.players[sOtherPlayer]["avatar"] = getNextAvatar(avatar);
		}

		//Now reset the avatar list to remove selected ones.
		//This is delayed so it happens after the menu close animation
		//is completed so the change isn't seen by the user.
		$timeout(function() {
			$scope.avatarList = availableAvatars();
		}, 250);
	};

	//Returns the list of avatars that are not currently selected.
	function availableAvatars() {
		return POSSIBLE_AVATARS.filter(function(avatar) {
			return(
				(avatar !== GAME.players["one"]["avatar"]) &&
				(avatar !== GAME.players["two"]["avatar"])
			);
		});
	}

	//Gets the next avatar that comes after the passed in one
	function getNextAvatar(avatar) {
		//Find the index of the current avatar
		var iAvatarIndex = POSSIBLE_AVATARS.indexOf(avatar);

		//We're going to use the next avatar in the list.
		//This also ensures the index is 0 if the avatar
		//wasn't found (which will never happen).
		iAvatarIndex++;

		//Loop to the beginning if at the end
		if(iAvatarIndex >= POSSIBLE_AVATARS.length) {
			iAvatarIndex = 0;
		}

		return POSSIBLE_AVATARS[iAvatarIndex];
	}

};
GameController.$inject = aGameInjects;
angular.module('TicTacToeMaterial').controller('GameController', GameController);

})();