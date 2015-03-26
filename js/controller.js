angular.module('hexSynth', [

	//services
    'audioServiceModule',
    'eventServiceModule',
    'hexCanvasServiceModule',
    'themeServiceModule',
    'visualizerServiceModule',

	//element directives
	'sliderVerticalModule',
	'dropDownModule',
	'knobElement',

	//directives
	'helpWindowModule',
	'synthControlsModule',
	'copierModule',
	'menuModule'
])

    .controller('hexController',
        function hexController( $scope , themeService ){
            $scope.copierVisible = false;
            $scope.helpWindowVisible = true;
            $scope.themeService = themeService;
        }
    );

