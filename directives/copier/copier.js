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

	copierController.$inject = ['$scope', 'audioService', 'THEMES', 'controlsService', 'menuService'];

	function copierController($scope, audioService,THEMES,controlsService,menuService) {

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
				menuService.synthIndex = parsedData.synthIndex;
				audioService.synthTemplates = angular.copy(parsedData.synthTemplates);
				menuService.themeIndex = parsedData.themeIndex;
				menuService.controlsIndex = parsedData.controlsIndex;
				menuService.visualizerIndex = parsedData.visualizerIndex;
				menuService.volume = parsedData.volume;
				//hexCanvasService.hexSize = parsedData.hexSize;
				//hexCanvasService.recalculateAndDrawHexes(true);
			}
			$scope.copierVisible = !$scope.copierVisible;
		}
	}