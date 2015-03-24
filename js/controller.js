angular.module('hexSynth', [
        "audioServiceModule",
        "eventServiceModule",
        "hexCanvasServiceModule",
        "themeServiceModule",
        "visualizerServiceModule",
        "knobElement",
        "sliderVerticalElement",
        "dropDownElement",
        "helpWindowModule",
        "synthControlsModule",
        "copierModule",
        "menuModule"
    ])

    .controller('hexController',
        function hexController( $scope , themeService ){
            $scope.copierVisible = false;
            $scope.helpWindowVisible = true;
            $scope.themeService = themeService;
        }
    );

