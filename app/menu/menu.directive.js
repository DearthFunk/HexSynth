angular
	.module('menuModule', [])
    .directive('menu', menu);

	menu.$inject = [];

	function menu () {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/menu/menu.directive.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope','$timeout','$rootScope','THEMES','controlsService','audioService','menuService', 'SYNTHS', 'localStorageService', 'visualizerService'];

    function menuController($scope,$timeout,$rootScope,THEMES,controlsService,audioService,menuService, SYNTHS, localStorageService, visualizerService) {

	    $scope.THEMES = THEMES;
	    $scope.controlsService = controlsService;
	    $scope.audioService = audioService;
	    $scope.menuService = menuService;
	    $scope.visualizerService = visualizerService;

	    $scope.helpButton = helpButton;
	    $scope.copierButton = copierButton;
	    $scope.changeTheme = changeTheme;
	    $scope.changeSynth = changeSynth;
	    $scope.resetSynth = resetSynth;
	    $scope.updateVolume = updateVolume;
	    $scope.updateSize = updateSize;

	    ////////////////////////////////////////////////////////

	    function updateSize(newVal, firstLoad) {
		    if (!firstLoad) {
			    $rootScope.$broadcast('hexSizeUpdate');
		    }

	    }
	    function updateVolume(newVal) {
		    audioService.changeVolume(newVal);
	    }
	    function changeTheme(index) {
		    menuService.themeIndex = index;
		    $rootScope.$broadcast('themeChange');
	    }

	    function changeSynth(index) {
		    menuService.synthIndex = index;
		    audioService.updateSynthValues();
	    }

	    function helpButton() {
		    $scope.helpWindowVisible = !$scope.helpWindowVisible;
		    $scope.copierVisible = false;
	    }

	    function copierButton() {
		    $scope.copierVisible = !$scope.copierVisible;
		    $scope.helpWindowVisible = false;
		    var data = JSON.stringify(localStorageService.getStorageInfo(menuService));
		    $rootScope.$broadcast('importExport', data);
	    }


	    function resetSynth(index) {
		    menuService.synthTemplates[index] = angular.copy(SYNTHS[index]);
		    $scope.resetIndex = index;
		    audioService.updateSynthValues();
		    $timeout(function () {
			    $scope.resetIndex = -1;
		    }, 400)
	    }
    }