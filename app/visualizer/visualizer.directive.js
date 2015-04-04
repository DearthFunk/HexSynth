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

	visualizerController.$inject = ['$scope', '$element', '$window', '$timeout', 'audioService', 'localStorageService', 'menuService', 'VisBubbles', 'VisTracer', 'VisScope'];

	function visualizerController($scope, $element, $window, $timeout, audioService, localStorageService, menuService, VisBubbles, VisTracer, VisScope) {

		var ctx = $element[0].getContext("2d");
		var drawSpeed = 20;
		var visualizerCanvas = this;
		var w, h = 0;
		var prom;

		$scope.windowResize = windowResize;
		$scope.timer = timer;
		$scope.$on('windowResize', $scope.windowResize);

		$scope.visualizers = [
			{name:"None",   globalCompositeOperation: "",            clearCanvas:false, vis: false},
			{name:"Bubbles",globalCompositeOperation: "lighter",     clearCanvas:true,  vis: new VisBubbles(ctx)},
			{name:"Scope",  globalCompositeOperation: "source-over", clearCanvas:false, vis: new VisScope(ctx)},
			{name:"Tracer", globalCompositeOperation: "lighter",     clearCanvas:true,  vis: new VisTracer(ctx)}
		];

		timer();
		windowResize();

		//////////////////////////////////////////////////////////////////

		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			ctx.canvas.style.width = w +'px';
			ctx.canvas.style.height = h + 'px';
			angular.element(ctx.canvas).attr({width:  w, height: h	});
		}
		function timer() {
			var vis = $scope.visualizers[menuService.visualizerIndex];
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
				switch($scope.visualizerIndex) {
					case 1: vis.vis.audioDB = audioService.getAverageDB(); break;
					case 2: vis.vis.audioData = audioService.getTimeArray(2,100); break;
				}
				vis.vis.draw();
			}
			prom = $timeout($scope.timer, drawSpeed);
		}
	}