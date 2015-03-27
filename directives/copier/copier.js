angular
	.module('copierModule', [])
    .directive('copier', copier);

	copier.$inject = [];

	function copier() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'directives/copier/copier.html',
			replace: true,
			controller: copierController,
			bindToController: true
		};
		return directive;
	}

	copierController.$inject = ['$scope', 'audioService', 'themeService', 'eventService', 'visualizerCanvasService', 'hexCanvasService'];

	function copierController($scope, audioService,themeService,eventService,visualizerCanvasService,hexCanvasService) {

		var client = new ZeroClipboard(document.getElementById('copyButton'));
		$scope.textAreaData = '';
		$scope.importData = importData;
		$scope.importExport = importExport;
		$scope.$on('importExport', $scope.importExport);

		/////////////////////////////////////////////

		function importExport(e,data) {
			$scope.textAreaData = data;
		}

		function importData() {
			var parsedData = JSON.parse($scope.textAreaData);
			if (parsedData != null) {
				audioService.synthIndex = parsedData.synthIndex;
				audioService.synthTemplates = angular.copy(parsedData.synthTemplates);
				themeService.themeIndex = parsedData.themeIndex;
				eventService.controlsIndex = parsedData.controlsIndex;
				visualizerCanvasService.visualizerIndex = parsedData.visualizerIndex;
				audioService.volume = parsedData.volume;
				hexCanvasService.hexSize = parsedData.hexSize;
				hexCanvasService.recalculateAndDrawHexes(true);
			}
			$scope.copierVisible = !$scope.copierVisible;
		}
	}