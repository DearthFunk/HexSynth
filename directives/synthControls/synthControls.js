angular.module('synthControlsModule', [])

    .directive('synthControls', function (audioService) {
        return {
            restrict:'C',
            templateUrl:'directives/synthControls/synthControls.html',
            replace: true,
            link: function(scope) {

                scope.resetIndex = -1;
                scope.audioService = audioService;
                scope.oscWaveTypes = oscWaveTypes;

                scope.callBack = {
                    toRun: function() {
                        audioService.updateSynthValues();
                    }
                };
                scope.updateWaveType = {
                    toRun:function(index,item) {
                        audioService.synthTemplates[audioService.synthIndex].controls.oscillators.type[index] = item;
                        audioService.updateSynthValues();

                    }
                }

            }
        }
    });
