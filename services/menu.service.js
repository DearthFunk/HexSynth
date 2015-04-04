angular
	.module('menuServiceModule', [])
	.factory('menuService', menuService);

menuService.$inject = ['localStorageService', 'SYNTHS'];

function menuService(localStorageService, SYNTHS){

	var service = {
		controlsIndex: localStorageService.storage ? localStorageService.storage.controlsIndex : 0,
		themeIndex: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.themeIndex : 0,
		hexSize: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.hexSize : 0.5,
		visualizerIndex: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.visualizerIndex : 0
		volume: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.volume : 0.5,
		synthIndex: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.synthIndex : 0
		synthTemplates: angular.copy(SYNTHS)
	};

	console.log(localStorageService.storage);

	return service;

}