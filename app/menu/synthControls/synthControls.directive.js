angular
	.module('menuModule')
    .directive('synthControls', synthControls);

	synthControls.$inject = [];

	function synthControls() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/menu/synthControls/synthControls.directive.html',
			replace: true,
			controller: synthControlsController,
			bindToController: true
		};
		return directive;
	}

	synthControlsController.$inject = ['$scope', 'audioService', 'menuService', 'OSC_WAVE_TYPES'];

	function synthControlsController($scope, audioService, menuService, OSC_WAVE_TYPES) {

		$scope.resetIndex = -1;
		$scope.audioService = audioService;
		$scope.OSC_WAVE_TYPES = OSC_WAVE_TYPES;

		$scope.callBack = {
			toRun: function () {
				audioService.updateSynthValues();
			}
		};
		$scope.updateWaveType = {
			toRun: function (index, item) {
				menuService.synthTemplates[menuService.synthIndex].controls.oscillators.type[index] = item;
				audioService.updateSynthValues();
			}
		}
	}