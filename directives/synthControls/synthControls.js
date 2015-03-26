angular
	.module('synthControlsModule', [])
    .directive('synthControls', synthControls)

	synthControls.$inject = [];

	function synthControls() {
		return {
			restrict: 'EA',
			templateUrl: 'directives/synthControls/synthControls.html',
			replace: true,
			link: synthControlsLink
		}
	}

	synthControlsLink.$inject = ['scope', 'audioservice'];

	function synthControlsLink(scope, audioService) {

		scope.resetIndex = -1;
		scope.audioService = audioService;
		scope.oscWaveTypes = oscWaveTypes;

		scope.callBack = {
			toRun: function () {
				audioService.updateSynthValues();
			}
		};
		scope.updateWaveType = {
			toRun: function (index, item) {
				//audioService.synthTemplates[audioService.synthIndex].controls.oscillators.type[index] = item;
				audioService.updateSynthValues();

			}
		}
	}