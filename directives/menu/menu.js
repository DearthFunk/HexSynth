angular
	.module('menuModule', [])
    .directive('menu', menu);

	menu.$inject = [];

	function menu () {
		var directive = {
			restrict: 'EA',
			templateUrl: 'directives/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope','$timeout','$rootScope','themeService','eventService','audioService','hexCanvasService','visualizerCanvasService', 'SYNTH_DEFAULT_TEMPLATES'];

    function menuController($scope,$timeout,$rootScope,themeService,eventService,audioService,hexCanvasService,visualizerCanvasService, SYNTH_DEFAULT_TEMPLATES) {

	    $scope.themeService = themeService;
	    $scope.eventService = eventService;
	    $scope.audioService = audioService;
	    $scope.hexCanvasService = hexCanvasService;
	    $scope.visualizerCanvasService = visualizerCanvasService;


	    $scope.helpButton = helpButton;
	    $scope.copierButton = copierButton;
	    $scope.changeTheme = changeTheme;
	    $scope.changeSynth = changeSynth;
	    $scope.resetSynth = resetSynth;

	    $scope.updateVolume = {
		    toRun: function (x) {
			    audioService.changeVolume(x);
		    }
	    };
	    $scope.updateSize = {
		    toRun: function (x, firstLoad) {
			    if (!firstLoad) {
				    hexCanvasService.recalculateAndDrawHexes(true);
			    }
		    }
	    };

	    ////////////////////////////////////////////////////////

	    function helpButton() {
		    $scope.helpWindowVisible = !$scope.helpWindowVisible;
		    $scope.copierVisible = false;
	    }

	    function copierButton() {
		    $scope.copierVisible = !$scope.copierVisible;
		    $scope.helpWindowVisible = false;
		    var data = JSON.stringify(getStorageInfo(audioService, themeService, eventService, visualizerCanvasService, hexCanvasService));
		    $rootScope.$broadcast("importExport", data);
	    }

	    function changeTheme(index) {
		    themeService.themeIndex = index;
		    hexCanvasService.recalculateAndDrawHexes(true);
	    }

	    function changeSynth(index) {
		    audioService.synthIndex = index;
		    audioService.updateSynthValues();
		    visualizerCanvasService.clearCanvas();
	    }

	    function resetSynth(index) {
		    audioService.synthTemplates[index] = angular.copy(SYNTH_DEFAULT_TEMPLATES[index]);
		    $scope.resetIndex = index;
		    audioService.updateSynthValues();
		    $timeout(function () {
			    $scope.resetIndex = -1;
		    }, 400)
	    }
    }