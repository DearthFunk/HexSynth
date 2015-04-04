angular.module('localStorageServiceModule', [])
	.factory("localStorageService", localStorageService);

	localStorageService.$inject = [];

	function localStorageService(){

		var service = {
			storage: JSON.parse(localStorage.getItem('hexSynthDearthFunkSaveObject')),
			getStorageInfo: getStorageInfo
		};
		if (service.storage != null) {
			if ('active' in service.storage) {
				if (service.storage.active){ service.storage = false}
			}
			else {
				service.storage = false;
			}
		}
		else {
			service.storage = false;
		}

		return service;

		/////////////////////////////////////////////////////

		function getStorageInfo(audioService,menuService) {
			return {
				active: false,
				volume: menuService.volume,
				hexSize: menuService.hexSize,
				synthIndex: menuService.synthIndex,
				themeIndex: menuService.themeIndex,
				controlsIndex: menuService.controlsIndex,
				visualizerIndex: menuService.visualizerIndex,
				synthTemplates: angular.copy(audioService.synthTemplates)
			};
		}
	}