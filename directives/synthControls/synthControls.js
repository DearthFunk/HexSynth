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

	synthControlsController.$inject = ['$scope', 'audioService'];

	function synthControlsController($scope, audioService) {

		$scope.resetIndex = -1;
		$scope.audioService = audioService;
		$scope.oscWaveTypes = oscWaveTypes;

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