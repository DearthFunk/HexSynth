angular.module('hexCanvasServiceModule', [])
    .service("hexCanvasService", function($window, $timeout, $rootScope,themeService, eventService, audioService, localStorageService){

        var hexCanvas = this;
        var w, h, lastHoverIndex = -1;
        var cnv = document.querySelectorAll('.hexCanvas')[0];
        var ctx = cnv.getContext("2d");
		var hexScreenPadding = 30;
		var notes = ["A","A '","B","C","C '","D","D '","E","F","F '","G","G '"];
        hexCanvas.hexGrid = {};
        hexCanvas.hoverIndex = -1;
        hexCanvas.hexSize = angular.isObject(localStorageService.storage) ? localStorageService.storage.hexSize : 0.5;

        hexCanvas.windowResize = function() {
            w = $window.innerWidth;
            h = $window.innerHeight;
            cnv.style.width = w +'px';
            cnv.style.height = h + 'px';
            angular.element(cnv).attr({width:  w, height: h	});
            hexCanvas.recalculateAndDrawHexes(true);
        };
		function pointInPolygon( vertx, verty, testx, testy ) {
			var i, j, c = false;
			for( i = 0, j = vertx.length-1; i < vertx.length; j = i++ ) {
				if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
					( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
					c = !c;
				}
			}
			return c;
		}

		function getHexSize(x) {
			return (10 - Math.floor(x * 14)) + 40;
		}
        hexCanvas.recalculateAndDrawHexes = function(forceRedraw) {
            hexCanvas.hexGrid = {
                hexHeight: Math.sqrt(3) * getHexSize(hexCanvas.hexSize),
                hexWidth: 2 * getHexSize(hexCanvas.hexSize),
                hexSide: (3 / 2) * getHexSize(hexCanvas.hexSize),
                hexes:[]
            };

            var xPos,yPos;
            var offsetColumn = false;
            var numCols = Math.floor((w - 255 - (2*hexScreenPadding)) / (hexCanvas.hexGrid.hexSide));
            var numRows = Math.floor((h - (2*hexScreenPadding)) / (hexCanvas.hexGrid.hexHeight)) - 1;

            var counter = -1;
            for (var col = 0; col < numCols; col++) {
                for (var row = 0; row < numRows; row++) {
                    counter++;
                    xPos = col * hexCanvas.hexGrid.hexSide + hexScreenPadding;
                    yPos = (row * hexCanvas.hexGrid.hexHeight) + (offsetColumn ? hexCanvas.hexGrid.hexHeight * 0.5 : 0) + hexScreenPadding;
                    var noteIndex = ((col%2 == 0 ? 0 : 9) + (Math.floor(col/2)+(row*5))) % notes.length;

                    hexCanvas.hexGrid.hexes.push({
                        col: col,
                        row: row,
                        noteIndex: noteIndex,
                        index:counter,
                        frequency: Math.floor(440 * Math.pow(2, (noteIndex + (row * 12) - 48) / 12)),
                        sharp: noteIndex == 1 || noteIndex == 3 || noteIndex == 6 || noteIndex == 8 || noteIndex == 10,
                        centerX: xPos - getHexSize(hexCanvas.hexSize) + hexCanvas.hexGrid.hexWidth,
                        centerY: yPos + (hexCanvas.hexGrid.hexHeight / 2),
                        xArray:[
                            xPos + hexCanvas.hexGrid.hexWidth - hexCanvas.hexGrid.hexSide,
                            xPos + hexCanvas.hexGrid.hexSide,
                            xPos + hexCanvas.hexGrid.hexWidth,
                            xPos + hexCanvas.hexGrid.hexSide,
                            xPos + hexCanvas.hexGrid.hexWidth - hexCanvas.hexGrid.hexSide,
                            xPos
                        ],
                        yArray:[
                            yPos,
                            yPos,
                            yPos + (hexCanvas.hexGrid.hexHeight / 2),
                            yPos + hexCanvas.hexGrid.hexHeight,
                            yPos + hexCanvas.hexGrid.hexHeight,
                            yPos + (hexCanvas.hexGrid.hexHeight / 2)
                        ]
                    });
                }
                offsetColumn = !offsetColumn;
            }
            hexCanvas.checkHexes(forceRedraw);
        };

        hexCanvas.drawHex = function( hex, hover , surround ) {
            // actual hex
            ctx.beginPath();
            ctx.lineWidth = hover ? 2 : 1;
            ctx.strokeStyle = hover ? themeService.themes[themeService.themeIndex].hexActive.border : themeService.themes[themeService.themeIndex].hex.border;
            ctx.fillStyle   = hover ?
                hex.sharp ?
                    themeService.themes[themeService.themeIndex].hexActive.fillSharp :
                    themeService.themes[themeService.themeIndex].hexActive.fill :
                hex.sharp ?
                    themeService.themes[themeService.themeIndex].hex.fillSharp :
                    themeService.themes[themeService.themeIndex].hex.fill;

            ctx.moveTo(hex.xArray[0],hex.yArray[0]);
            for (var i =1; i < hex.xArray.length; i++){
                ctx.lineTo(hex.xArray[i],hex.yArray[i]);
            }
            ctx.lineTo(hex.xArray[0],hex.yArray[0]);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // inner dot
            ctx.beginPath();
            ctx.fillStyle = hover ? themeService.themes[themeService.themeIndex].hexActive.innerDot : themeService.themes[themeService.themeIndex].hex.innerDot;
            ctx.arc(hex.centerX,hex.centerY,2,0,Math.PI*2,false);
            ctx.fill();
            ctx.closePath();

            //inner text
            ctx.beginPath();

            ctx.fillStyle = hover ? themeService.themes[themeService.themeIndex].hexActive.text : themeService.themes[themeService.themeIndex].hex.text;
            ctx.textAlign = 'center';

            ctx.font="bold  12px Georgia";ctx.fillText(notes[hex.noteIndex], hex.centerX, hex.centerY-10);
            ctx.font="10px Georgia";ctx.fillText(
                hex.frequency
                //hex.col +"-"+ hex.row +"-"+hex.index
                , hex.centerX, hex.centerY+18);
            ctx.closePath();

        };

        hexCanvas.checkHexes = function(overRide) {
            if (eventService.controlsIndex == 0) {
                //get hover index
                if (!eventService.events.mouseDown) {
                    hexCanvas.hoverIndex = -1;
                    for (var i = 0; i < hexCanvas.hexGrid.hexes.length; i++){
                        if (pointInPolygon(hexCanvas.hexGrid.hexes[i].xArray,hexCanvas.hexGrid.hexes[i].yArray,eventService.events.mouseX,eventService.events.mouseY)) {
                            hexCanvas.hoverIndex = i;
                            break;
                        }
                    }
                }
            }
            if (eventService.controlsIndex == 1 && overRide) {
                hexCanvas.hoverIndex = -1;
                for (i = 0; i < hexCanvas.hexGrid.hexes.length; i++){
                    if (pointInPolygon(hexCanvas.hexGrid.hexes[i].xArray,hexCanvas.hexGrid.hexes[i].yArray,eventService.events.mouseX,eventService.events.mouseY)) {
                        hexCanvas.hoverIndex = i;
                        break;
                    }
                }
            }

            //-----------------------------------------------------draw hexes
            if (hexCanvas.hoverIndex != lastHoverIndex || overRide) {
                ctx.clearRect(0, 0, w, h);
                for (i = 0; i < hexCanvas.hexGrid.hexes.length; i++){
                    if (i != hexCanvas.hoverIndex) { hexCanvas.drawHex(hexCanvas.hexGrid.hexes[i], false); }
                }
            }
            //draw hover hex last, so that the border stands out
            if ((hexCanvas.hoverIndex != -1)) {
                hexCanvas.drawHex(hexCanvas.hexGrid.hexes[hexCanvas.hoverIndex],true);
            }
            //play notes
            hexCanvas.hoverIndex == -1 ? audioService.stopHexSound() : audioService.playHexSound(hexCanvas.hexGrid.hexes[hexCanvas.hoverIndex].frequency);
            lastHoverIndex = hexCanvas.hoverIndex;
        };

        hexCanvas.windowResize();
        hexCanvas.recalculateAndDrawHexes(true);

    });