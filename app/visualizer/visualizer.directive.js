angular
	.module('visualizerModule', [])
    .directive('visualizer', visualizer);

	visualizer.$inject = [];

	function visualizer() {
		var directive = {
			restrict: 'A',
			scope: {},
			replace: true,
			controller: visualizerController,
			bindToController: true
		};
		return directive
	}

	visualizerController.$inject = ['$scope', '$element', '$window', '$timeout', 'visualizerService', 'audioService', 'menuService'];

	function visualizerController($scope, $element, $window, $timeout, visualizerService, audioService, menuService) {

		var prom;
		var w = 0,
			h = 0;
		var ctx = $element[0].getContext('2d');
		for (var i = 0; i < visualizerService.visualizers.length; i++) {
			if (visualizerService.visualizers[i].vis) {
				visualizerService.visualizers[i].vis.ctx = ctx;
			}
		}

		$scope.windowResize = windowResize;
		$scope.timer = timer;
		$scope.$on('windowResize', $scope.windowResize);

		windowResize();
		timer();

		//////////////////////////////////////////////////////////////////

		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			ctx.canvas.style.width = w +'px';
			ctx.canvas.style.height = h + 'px';
			angular.element(ctx.canvas).attr({width: w, height: h});
		}
		function timer() {
			var vis = visualizerService.visualizers[menuService.visualizerIndex];
			if (vis.clearCanvas || !vis) {
				ctx.clearRect(0,0, w,h);
			}
			else {
				var oldArray = ctx.getImageData(0,0,w,h);
				for(var d = 3; d < oldArray.data.length; d+=4 ){
					oldArray.data[d] = Math.floor(oldArray.data[d]*0.9);
				}
				ctx.putImageData(oldArray,0,0);
			}

			if (vis.vis) {
				switch(menuService.visualizerIndex) {
					case 1: vis.vis.audioDB = audioService.getAverageDB(); break;
					case 2: vis.vis.audioData = audioService.getTimeArray(2,100); break;
				}
				console.log($scope.visualizerIndex);
				vis.vis.draw();
			}
			prom = $timeout($scope.timer, 30);
		}
	}