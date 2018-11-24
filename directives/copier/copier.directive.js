angular
	.module('copierModule', [])
    .directive('copier', copierDirective);

	copierDirective.$inject = [];

	function copierDirective() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'directives/copier/copier.directive.html',
			replace: true,
			controller: copierController,
			bindToController: true
		};
		return directive;
	}

	copierController.$inject = ['$scope', 'menuService'];

	function copierController($scope, menuService) {

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
				menuService.synthTemplates = angular.copy(parsedData.synthTemplates);
				menuService.themeIndex = parsedData.themeIndex;
				menuService.controlsIndex = parsedData.controlsIndex;
				menuService.visualizerIndex = parsedData.visualizerIndex;
				menuService.volume = parsedData.volume;
				menuService.hexSize = parsedData.hexSize;
				//hexCanvasService.recalculateAndDrawHexes(true);
			}
			$scope.copierVisible = !$scope.copierVisible;
		}
	}