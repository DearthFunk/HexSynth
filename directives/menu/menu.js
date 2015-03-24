angular.module('menuModule', [])

    .directive('menu', function ($timeout,$rootScope,themeService,eventService,audioService,hexCanvasService,visualizerCanvasService) {
        return {
            restrict:'C',
            templateUrl:'directives/menu/menu.html',
            replace: true,
            link: function(scope)	{

                scope.themeService = themeService;
                scope.eventService = eventService;
                scope.audioService = audioService;
                scope.hexCanvasService = hexCanvasService;
                scope.visualizerCanvasService = visualizerCanvasService;

                scope.updateVolume = {
                    toRun: function(x) {
                        audioService.changeVolume(x);
                    }
                };
                scope.updateSize = {
                    toRun: function(x,firstLoad) {
                        if (!firstLoad) {
                            hexCanvasService.recalculateAndDrawHexes(true);
                        }
                    }
                };

                scope.helpButton = function() {
                    scope.helpWindowVisible = !scope.helpWindowVisible;
                    scope.copierVisible = false;
                };

                scope.copierButton = function() {
                    scope.copierVisible = !scope.copierVisible;
                    scope.helpWindowVisible = false;
                    var data = JSON.stringify(getStorageInfo(audioService,themeService,eventService,visualizerCanvasService,hexCanvasService));
                    $rootScope.$broadcast("importExport",data);
                };

                scope.changeTheme = function(index) {
                    themeService.themeIndex = index;
                    hexCanvasService.recalculateAndDrawHexes(true);
                };

                scope.changeSynth = function(index) {
                    audioService.synthIndex = index;
                    audioService.updateSynthValues();
                    visualizerCanvasService.clearCanvas();
                };

                scope.resetSynth = function(index) {
                    audioService.synthTemplates[index] = deepCopy(synthTemplates[index]);
                    scope.resetIndex = index;
                    audioService.updateSynthValues();
                    $timeout(function() {
                        scope.resetIndex = -1;
                    },400)
                }





            }
        }
    });