angular
	.module('synthControlsModule', [])
    .directive('synthControls', synthControls);

	synthControls.$inject = [];

	function synthControls() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'directives/synthControls/synthControls.html',
			replace: true,
			controller: synthControlsController,
			bindToController: true
		};
		return directive;
	}

	synthControlsController.$inject = ['$scope', 'audioService', 'OSC_WAVE_TYPES'];

	function synthControlsController($scope, audioService, OSC_WAVE_TYPES) {

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
				audioService.synthTemplates[audioService.synthIndex].controls.oscillators.type[index] = item;
				audioService.updateSynthValues();
			}
		}
	}