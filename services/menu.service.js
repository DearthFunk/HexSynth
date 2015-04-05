angular
	.module('menuServiceModule', [])
	.factory('menuService', menuService);

menuService.$inject = ['localStorageService', 'SYNTHS'];

function menuService(localStorageService, SYNTHS){

	var service = {
		controlsIndex:      localStorageService.storage ? localStorageService.storage.controlsIndex : 0,
		themeIndex:         localStorageService.storage ? localStorageService.storage.themeIndex : 0,
		hexSize:            localStorageService.storage ? localStorageService.storage.hexSize : 0.5,
		visualizerIndex:    localStorageService.storage ? localStorageService.storage.visualizerIndex : 0,
		volume:             localStorageService.storage ? localStorageService.storage.volume : 0.5,
		synthIndex:         localStorageService.storage ? localStorageService.storage.synthIndex : 0,
		synthTemplates:     localStorageService.storage ? localStorageService.storage.synthTemplates : angular.copy(SYNTHS)
	};

	return service;

}