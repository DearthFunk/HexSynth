angular.module('visualizerServiceModule', [])
    .service("visualizerCanvasService", visualizerCanvasService);

	visualizerCanvasService.$inject = ['$window', '$timeout', 'audioService', 'localStorageService', 'VisBubbles', 'VisTracer', 'VisScope'];

	function visualizerCanvasService($window, $timeout, audioService, localStorageService, VisBubbles, VisTracer, VisScope){

        //var cnv =;
        var ctx = document.querySelectorAll('.visualizerCanvas')[0].getContext("2d");
		var drawSpeed = 20;
        var visualizerCanvas = this;
        var w, h = 0;
        var prom;

		visualizerCanvas.windowResize = windowResize;
		visualizerCanvas.timer = timer;

		windowResize();

		visualizerCanvas.visualizerIndex = angular.isObject(localStorageService.storage) ? localStorageService.storage.visualizerIndex : 0;
		visualizerCanvas.visualizers = [
			{name:"None",   globalCompositeOperation: "",            clearCanvas:false, vis: false},
			{name:"Bubbles",globalCompositeOperation: "lighter",     clearCanvas:true,  vis: new VisBubbles(ctx)},
			{name:"Scope",  globalCompositeOperation: "source-over", clearCanvas:false, vis: new VisScope(ctx)},
			{name:"Tracer", globalCompositeOperation: "lighter",     clearCanvas:true,  vis: new VisTracer(ctx)}
		];

		timer();

		////////////////////////////////////////////////////////////

		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			ctx.canvas.style.width = w +'px';
			ctx.canvas.style.height = h + 'px';
			angular.element(ctx.canvas).attr({width:  w, height: h	});
		}
		function timer() {
			var vis = visualizerCanvas.visualizers[visualizerCanvas.visualizerIndex];
			if (vis.clearCanvas || !vis) {
				ctx.clearRect(0,0, w,h);
			}
			else {
				var oldArray = ctx.getImageData(0,0,w,h);
				for(var d=3;d<oldArray.data.length;d+=4){//dim it with some feedback, I'm using .9
					oldArray.data[d] = Math.floor(oldArray.data[d]*.9);
				}
				ctx.putImageData(oldArray,0,0);
			}

			if (vis.vis) {
				switch(visualizerCanvas.visualizerIndex) {
					case 1: vis.vis.audioDB = audioService.getAverageDB(); break;
					case 2: vis.vis.audioData = audioService.getTimeArray(2,100); break;
				}
				vis.vis.draw();
			}
			prom = $timeout(visualizerCanvas.timer, drawSpeed);
		}
	}