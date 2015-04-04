angular
	.module('controlsServiceModule', [])
	.factory('controlsService', controlsService);

controlsService.$inject = ['localStorageService'];

function controlsService(localStorageService){
	var service = {
		controls: [
			{
				name: 'Follower',
				bypasses: [65, 83, 68, 90, 88, 67],
				bypassFunctions: ['bitcrusher', 'overdrive', 'tremolo', 'wahwah', 'phaser', 'delay']
			},
			{
				name: 'Clicker',
				bypasses: [65, 83, 68, 90, 88, 67],
				bypassFunctions: ['bitcrusher', 'overdrive', 'tremolo', 'wahwah', 'phaser', 'delay']
			}
		],
		controlsIndex: angular.isObject(localStorageService.storage) ? localStorageService.storage.controlsIndex : 0,
		events: {
			mouseX: 0,
			mouseY: 0,
			mouseDown: false,
			keyFx1: false,
			keyFx2: false,
			keySquare: false
		}
	};
	return service;
}