angular
	.module('menuModule', [])
    .directive('menu', menu);

	menu.$inject = [];

	function menu () {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope','$timeout','$rootScope','THEMES','controlsService','audioService','menuService', 'SYNTH_DEFAULT_TEMPLATES', 'localStorageService'];

    function menuController($scope,$timeout,$rootScope,THEMES,controlsService,audioService,menuService, SYNTH_DEFAULT_TEMPLATES, localStorageService) {

	    $scope.THEMES = THEMES;
	    $scope.controlsService = controlsService;
	    $scope.audioService = audioService;
	   // $scope.hexCanvasService = hexCanvasService;
	    $scope.menuService = menuService;


	    $scope.helpButton = helpButton;
	    $scope.copierButton = copierButton;
	    $scope.changeTheme = changeTheme;
	    $scope.changeSynth = changeSynth;
	    $scope.resetSynth = resetSynth;

	    $scope.updateVolume = updateVolume;
	    $scope.updateSize = updateSize;

	    function updateSize(newVal, firstLoad) {
		    if (!firstLoad) {
			   // hexCanvasService.recalculateAndDrawHexes(true);
		    }

	    }
	    function updateVolume(newVal) {
		    audioService.changeVolume(newVal);
	    }

	    ////////////////////////////////////////////////////////

	    function helpButton() {
		    $scope.helpWindowVisible = !$scope.helpWindowVisible;
		    $scope.copierVisible = false;
	    }

	    function copierButton() {
		    $scope.copierVisible = !$scope.copierVisible;
		    $scope.helpWindowVisible = false;
		    var data = JSON.stringify(localStorageService.getStorageInfo(audioService, THEMES, controlsService, menuService));
		    $rootScope.$broadcast("importExport", data);
	    }

	    function changeTheme(index) {
		    menuService.themeIndex = index;
		    //hexCanvasService.recalculateAndDrawHexes(true);
	    }

	    function changeSynth(index) {
		    menuService.synthIndex = index;
		    audioService.updateSynthValues();
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