(function() {'use strict';

var aDependencies = ['ngMaterial', 'LocalStorageModule'];
var ticTacToeApp = angular.module('TicTacToeMaterial', aDependencies);

ticTacToeApp.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('deep-orange')
		.accentPalette('amber');
}]);

ticTacToeApp.config(['$mdIconProvider', function($mdIconProvider) {
	$mdIconProvider.defaultIconSet('/style/lib/mdi.svg');
}]);

ticTacToeApp.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
	localStorageServiceProvider
		.setPrefix('ticTacToeMaterial')
}]);

})();