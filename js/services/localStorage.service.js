angular.module('localStorageServiceModule', [])
	.service("localStorageService", function(){

		var localStorageServiceScope = this;

		localStorageServiceScope.storage = JSON.parse(localStorage.getItem('hexSynthDearthFunkSaveObject'));
		if (localStorageServiceScope.storage != null) {
			if ('active' in localStorageServiceScope.storage) {
				if (localStorageServiceScope.storage.active){ localStorageServiceScope.storage = false}
			}
			else {
				localStorageServiceScope.storage = false;
			}
		}
		else {
			localStorageServiceScope.storage = false;
		}



		localStorageServiceScope.getStorageInfo = function (audioService,themeService,eventService,visualizerCanvasService,hexCanvasService) {
			return {
				active: false,
				volume: audioService.volume,
				hexSize: hexCanvasService.hexSize,
				synthIndex: audioService.synthIndex,
				themeIndex: themeService.themeIndex,
				controlsIndex: eventService.controlsIndex,
				visualizerIndex: visualizerCanvasService.visualizerIndex,
				synthTemplates: angular.copy(audioService.synthTemplates)
			};
		}



	});

