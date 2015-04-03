angular.module('visualizerServiceModule', [])
    .service("visualizerCanvasService", visualizerCanvasService);

	visualizerCanvasService.$inject = ['$window', '$timeout', 'hexCanvasService', 'eventService', 'audioService', 'localStorageService', 'browserService', 'mathService'];

	function visualizerCanvasService($window, $timeout, hexCanvasService,eventService, audioService, localStorageService, browserService, mathService){

        var cnv = document.querySelectorAll('.visualizerCanvas')[0];
        var ctx = cnv.getContext("2d");
		var drawSpeed = 20;
        var visualizerCanvas = this;
        var w, h,xCenter,yCenter = 0;
        var prom;



		function randomRGBA () {
			return 'rgba(' +
				Math.floor(Math.random()*255+1) + ',' +
				Math.floor(Math.random()*255+1) + ',' +
				Math.floor(Math.random()*255+1) + ',' +
				Math.random() + ')';
		}

        visualizerCanvas.visualizerIndex = angular.isObject(localStorageService.storage) ? localStorageService.storage.visualizerIndex : 0;
        visualizerCanvas.visualizers = [
	        {name:"None",   globalCompositeOperation: "",            clearCanvas:false, functionToRun: false},
	        {name:"Bubbles",globalCompositeOperation: "lighter",     clearCanvas:true,  functionToRun: "visBubbles"},
	        {name:"Scope",  globalCompositeOperation: "source-over", clearCanvas:false, functionToRun: "visScope"},
	        {name:"Tracer",   globalCompositeOperation: "lighter",   clearCanvas:true,  functionToRun: "visTracer"}
        ];

        visualizerCanvas.windowResize = function() {
            w = $window.innerWidth;
            h = $window.innerHeight;
            cnv.style.width = w +'px';
            cnv.style.height = h + 'px';
            xCenter = w /2;
            yCenter = h/ 2;
            angular.element(cnv).attr({width:  w, height: h	});
        };

        visualizerCanvas.clearCanvas = function() {
            ctx.clearRect(0,0, w,h);
        };

        visualizerCanvas.timer = function() {
            // clear or redraw canvas and run funciton
            if(typeof visualizerCanvas[visualizerCanvas.visualizers[visualizerCanvas.visualizerIndex].functionToRun] == 'function'){
                if (visualizerCanvas.visualizers[visualizerCanvas.visualizerIndex].clearCanvas) {
                    visualizerCanvas.clearCanvas();
                }
                else {
                    var oldArray = ctx.getImageData(0,0,w,h);
                    for(var d=3;d<oldArray.data.length;d+=4){//dim it with some feedback, I'm using .9
                        oldArray.data[d] = Math.floor(oldArray.data[d]*.9);
                    }
                    ctx.putImageData(oldArray,0,0);
                }
                visualizerCanvas[visualizerCanvas.visualizers[visualizerCanvas.visualizerIndex].functionToRun]();
            }
            prom = $timeout(visualizerCanvas.timer, drawSpeed);
        };

        visualizerCanvas.windowResize();
        visualizerCanvas.timer();


		visualizerCanvas.getFreqArray = getFreqArray;
		visualizerCanvas.getTimeArray = getTimeArray;
		visualizerCanvas.getAverageDB = getAverageDB;




/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------- VISUALIZERS --------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/
        function getFreqArray(depth,removal) {
            var theSmallArray = [];
            var theFreqArray =  new Uint8Array(audioService.analyser.frequencyBinCount);
            audioService.analyser.getByteFrequencyData(theFreqArray);
            var x = depth == undefined ? 1 : depth;
            var len = theFreqArray.length - removal;
            for (var i =0; i < len; i += x) {
                theSmallArray.push( theFreqArray[i] );
            }
            return theSmallArray;
        }
		function getTimeArray(depth,removal) {
            var theSmallArray = [];
			var theTimeArray  = new Uint8Array(audioService.analyser.frequencyBinCount);
			audioService.analyser.getByteTimeDomainData(theTimeArray);
            var x = depth == undefined ? 1 : depth;
            var len = theTimeArray.length - removal;
            for (var i =0; i < len; i += x) {
                theSmallArray.push( theTimeArray[i] );
            }
			return theSmallArray;
		}
        function getAverageDB() {
            var dbArray = new Uint8Array(audioService.analyser.frequencyBinCount);
            audioService.analyser.getByteFrequencyData(dbArray);
            var values = 0;
            for (var i = 0; i < dbArray.length; i++) {
                values += dbArray[i];
            }
            return values / dbArray.length;
        }
/*---------------------------------------------------------------------------------------------------------TRACERS-------*/

        function newTracerDot () {
            return {
                r: mathService.randomNumber(2,10),
                speed: mathService.randomNumber(0,0.04),
                orbit: Math.random()*10,
                angle: 0
            }
        }

        var tracerAngle = 0;
        var tracerDots = [];
        var tracerTotalDots = 30;
        var tracerTotalClusters = 6;
        var tracerRadius = 30;
        visualizerCanvas.visTracer = function() {
            if (hexCanvasService.hoverIndex != -1) {
                var activeHex = hexCanvasService.hexGrid.hexes[hexCanvasService.hoverIndex];
                var distanceFromCenter = Math.sqrt( Math.pow(eventService.events.mouseX - activeHex.centerX, 2) + Math.pow(eventService.events.mouseY - activeHex.centerY, 2) );
                ctx.fillStyle = "#FFFFFF";
                if (!browserService.isFirefox){ctx.strokeStyle = "#FF0000";}
                tracerAngle += distanceFromCenter/1000;

                for (var cluster = 0; cluster < tracerTotalClusters; cluster++) {
                    var clusterA = cluster/tracerTotalClusters * 2 * Math.PI;

                    var clusterX = (tracerRadius*2/3) * Math.cos(clusterA + (cluster%2==0?tracerAngle:-1*tracerAngle)) + activeHex.centerX;
                    var clusterY =  (tracerRadius*2/3) * Math.sin(clusterA + (cluster%2==0?tracerAngle:-1*tracerAngle)) + activeHex.centerY;

                    if (tracerDots[cluster] == undefined) {tracerDots.push([]);}
                    for (var i = 0; i < tracerTotalDots; i++) {
                        if (tracerDots[cluster][i] == undefined) {tracerDots[cluster].push(newTracerDot());}

                        var dot = tracerDots[cluster][i];
                        dot.r -= 1/distanceFromCenter;
                        dot.angle += dot.speed;

                        if (dot.r < 0) { tracerDots[cluster][i] = newTracerDot(); }
                        else {
                            ctx.beginPath();
                            ctx.arc(
                                clusterX + Math.cos(i + dot.angle) * dot.orbit * dot.angle * 4.5,
                                clusterY + Math.sin(i + dot.angle) * dot.orbit * dot.angle * 4.5,
                                dot.r,
                                0, Math.PI*2, true
                            );
                            ctx.fill();
                            if (!browserService.isFirefox){	ctx.stroke(); }
                            ctx.closePath();
                        }
                    }
                }

            }
        };


/*---------------------------------------------------------------------------------------------------------SCOPE------*/
		visualizerCanvas.visScope = function() {
			var timeArray = visualizerCanvas.getTimeArray(2,100);
            var barWidth = w / timeArray.length;
			ctx.beginPath();
			ctx.lineWidth = 4;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.strokeStyle = "#FFFFFF";

			for (var i = 0; i < timeArray.length; i++) {
				var percent = timeArray[i] / 256;
				var percent2 = i < timeArray.length ? timeArray[i+1] / 256 : timeArray[i] / 256;
				var height = h * percent;
				var height2 = h * percent2;
				var offset = h - height - 1;
				var offset2 = h - height2 - 1;
				ctx.moveTo(i*barWidth,offset);
				ctx.lineTo(i*barWidth+barWidth,offset2);
			}
			ctx.stroke();
			ctx.closePath();
		};

/*---------------------------------------------------------------------------------------------------------BUBBLES----*/

        var totalBalls = browserService.isChrome ? 1000 : 100;
        var balls = [];
        function newBall() {
            return {
                x: mathService.randomNumber(0,w),
                y: h+15,
                r: 15,
                yX: mathService.randomNumber(1,5),
                rX: mathService.randomNumber(0.1,2),
                color: randomRGBA()
            };
        }
        for (i = 0; i < totalBalls; i++) { balls.push(newBall()); }

		visualizerCanvas.visBubbles = function() {
            var db = visualizerCanvas.getAverageDB();
            for (var i = 0; i < balls.length; i++) {
                var ball = balls[i];
                ball.y -= (ball.yX * (1 + (db/100)));
                ball.r -= (ball.rX * (1 + (db/30)));
                if(ball.y + ball.r < -15 || ball.r < 0 ) {balls[i] = newBall();}
                else {
                    ctx.beginPath();
                    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2, false);
                    ctx.fillStyle = ball.color;
                    ctx.fill();
                    ctx.closePath();
                }
            }

		};
	}