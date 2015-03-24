angular.module('copierModule', [])

    .directive('copier', function ($rootScope,audioService,themeService,eventService,visualizerCanvasService,hexCanvasService) {
        return {
            restrict:'C',
            templateUrl:'directives/copier/copier.html',
            replace: true,
            link: function(scope)	{


                var client = new ZeroClipboard( document.getElementById("copyButton") );
                scope.textAreaData = '';

                scope.$on("importExport",function(event,data){
                    scope.textAreaData = data;
                });

                scope.importData = function() {
                    var parsedData = JSON.parse(scope.textAreaData);
                    if (parsedData != null){
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
        }
    });