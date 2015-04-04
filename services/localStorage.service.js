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

		function getStorageInfo(audioService,themeService,controlsService,visualizerService,hexCanvasService) {
			return {
				active: false,
				volume: audioService.volume,
				hexSize: hexCanvasService.hexSize,
				synthIndex: audioService.synthIndex,
				themeIndex: themeService.themeIndex,
				controlsIndex: controlsService.controlsIndex,
				visualizerIndex: visualizerService.visualizerIndex,
				synthTemplates: angular.copy(audioService.synthTemplates)
			};
		}
	}