angular
	.module('menuServiceModule', [])
	.factory('menuService', menuService);

menuService.$inject = ['localStorageService'];

function menuService(localStorageService){

	var service = {
		controlsIndex: 0, //angular.isObject(localStorageService.storage) ? localStorageService.storage.controlsIndex : 0,
		themeIndex: 0, //angular.isObject(localStorageService.storage) ? localStorageService.storage.themeIndex : 0,
		hexSize: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.hexSize : 0.5,
		visualizerIndex: 1, //angular.isObject(localStorageService.storage) ? localStorageService.storage.visualizerIndex : 0
		volume: 0.5, //angular.isObject(localStorageService.storage) ? localStorageService.storage.volume : 0.5,
		synthIndex: 1 //angular.isObject(localStorageService.storage) ? localStorageService.storage.synthIndex : 0


};

	return service;

}