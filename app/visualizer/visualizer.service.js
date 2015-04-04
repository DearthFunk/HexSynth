angular
	.module('visualizerModule')
	.factory("visualizerService", visualizerService);

visualizerService.$inject = ['localStorageService'];

function visualizerService(localStorageService){

	var service = {
		visualizerIndex: 1 //angular.isObject(localStorageService.storage) ? localStorageService.storage.visualizerIndex : 0
	};

	return service;

}