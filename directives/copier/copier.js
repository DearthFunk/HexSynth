angular
	.module('copierModule', [])
    .directive('copier', copier);

	copier.$inject = [];

	function copier() {
		return {
			restrict: 'EA',
			templateUrl: 'directives/copier/copier.html',
			replace: true,
			link: copierLink
		}
	}

	copierLink.$inject = ['scope', 'audioService', 'themeService', 'eventService', 'visualizerCanvasService', 'hexCanvasService'];

	function copierLink(scope, audioService,themeService,eventService,visualizerCanvasService,hexCanvasService) {

		var client = new ZeroClipboard(document.getElementById("copyButton"));
		scope.textAreaData = '';
		scope.importData = importData;
		scope.importExport = importExport;
		scope.$on("importExport", scope.importExport);

		/////////////////////////////////////////////

		function importExport(e,data) {
			scope.textAreaData = data;
		}

		function importData() {
			var parsedData = JSON.parse(scope.textAreaData);
			if (parsedData != null) {
				audioService.synthIndex = parsedData.synthIndex;
				audioService.synthTemplates = deepCopy(parsedData.synthTemplates);
				themeService.themeIndex = parsedData.themeIndex;
				eventService.controlsIndex = parsedData.controlsIndex;
				visualizerCanvasService.visualizerIndex = parsedData.visualizerIndex;
				audioService.volume = parsedData.volume;
				hexCanvasService.hexSize = parsedData.hexSize;
				hexCanvasService.recalculateAndDrawHexes(true);
			}
			scope.copierVisible = !scope.copierVisible;
		}
	}