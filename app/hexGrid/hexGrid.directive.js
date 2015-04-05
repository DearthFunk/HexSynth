angular
	.module('hexGridModule', [])
    .directive('hexGrid', hexGrid);

	hexGrid.$inject = [];

	function hexGrid() {
		var directive = {
			restrict: 'EA',
			replace: true,
			controller: hexGridController,
			bindToController: true
		};
		return directive;
	}

	hexGridController.$inject = ['$scope', '$element', '$window', 'THEMES', 'controlsService', 'audioService', 'menuService'];

	function hexGridController($scope, $element, $window, THEMES, controlsService, audioService, menuService){

		var notes = ['A','A\'','B','C','C\'','D','D\'','E','F','F\'','G','G\''];
        var w = -1,
	        h = -1,
	        hoverIndex = -1,
	        lastHoverIndex = -1;
        var ctx = $element[0].getContext('2d');
		var hexScreenPadding = 30;
        var hexGrid = {};

		$scope.windowResize = windowResize;
		$scope.recalculateAndDrawHexes = recalculateAndDrawHexes;
		$scope.drawHex = drawHex;
		$scope.checkHexes = checkHexes;

		$scope.$on('redrawGrid', $scope.recalculateAndDrawHexes);

		windowResize();

		////////////////////////////////////////////////
		
        function windowResize() {
            w = $window.innerWidth;
            h = $window.innerHeight;
            ctx.canvas.style.width = w +'px';
            ctx.canvas.style.height = h + 'px';
            angular.element(ctx.canvas).attr({width:  w, height: h	});
            $scope.recalculateAndDrawHexes(true);
        }
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
		function recalculateAndDrawHexes(forceRedraw) {
			var size = getHexSize(menuService.hexSize);
            hexGrid = {
                hexHeight: Math.sqrt(3) * size,
                hexWidth: 2 * size,
                hexSide: (3 / 2) * size,
                hexes:[]
            };

            var xPos,yPos;
            var offsetColumn = false;
            var numCols = Math.floor((w - 255 - (2*hexScreenPadding)) / (hexGrid.hexSide));
            var numRows = Math.floor((h - (2*hexScreenPadding)) / (hexGrid.hexHeight)) - 1;

            var counter = -1;
            for (var col = 0; col < numCols; col++) {
                for (var row = 0; row < numRows; row++) {
                    counter++;
                    xPos = col * hexGrid.hexSide + hexScreenPadding;
                    yPos = (row * hexGrid.hexHeight) + (offsetColumn ? hexGrid.hexHeight * 0.5 : 0) + hexScreenPadding;
                    var noteIndex = ((col%2 === 0 ? 0 : 9) + (Math.floor(col/2)+(row*5))) % notes.length;

                    hexGrid.hexes.push({
                        col: col,
                        row: row,
                        noteIndex: noteIndex,
                        index:counter,
                        frequency: Math.floor(440 * Math.pow(2, (noteIndex + (row * 12) - 48) / 12)),
                        sharp: noteIndex === 1 || noteIndex === 3 || noteIndex === 6 || noteIndex === 8 || noteIndex === 10,
                        centerX: xPos - getHexSize(menuService.hexSize) + hexGrid.hexWidth,
                        centerY: yPos + (hexGrid.hexHeight / 2),
                        xArray:[
                            xPos + hexGrid.hexWidth - hexGrid.hexSide,
                            xPos + hexGrid.hexSide,
                            xPos + hexGrid.hexWidth,
                            xPos + hexGrid.hexSide,
                            xPos + hexGrid.hexWidth - hexGrid.hexSide,
                            xPos
                        ],
                        yArray:[
                            yPos,
                            yPos,
                            yPos + (hexGrid.hexHeight / 2),
                            yPos + hexGrid.hexHeight,
                            yPos + hexGrid.hexHeight,
                            yPos + (hexGrid.hexHeight / 2)
                        ]
                    });
                }
                offsetColumn = !offsetColumn;
            }
            checkHexes(forceRedraw);
        }

        function drawHex(hex, hover) {
           ctx.beginPath();
            ctx.lineWidth = hover ? 2 : 1;
            ctx.strokeStyle = hover ? THEMES[menuService.themeIndex].hexActive.border : THEMES[menuService.themeIndex].hex.border;
            ctx.fillStyle   = hover ?
                hex.sharp ?
                    THEMES[menuService.themeIndex].hexActive.fillSharp :
                    THEMES[menuService.themeIndex].hexActive.fill :
                hex.sharp ?
                    THEMES[menuService.themeIndex].hex.fillSharp :
                    THEMES[menuService.themeIndex].hex.fill;

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
            ctx.fillStyle = hover ? THEMES[menuService.themeIndex].hexActive.innerDot : THEMES[menuService.themeIndex].hex.innerDot;
            ctx.arc(hex.centerX,hex.centerY,2,0,Math.PI*2,false);
            ctx.fill();
            ctx.closePath();

            //inner text
            ctx.beginPath();

            ctx.fillStyle = hover ? THEMES[menuService.themeIndex].hexActive.text : THEMES[menuService.themeIndex].hex.text;
            ctx.textAlign = 'center';

            ctx.font='bold  12px Georgia';
	        ctx.fillText(notes[hex.noteIndex], hex.centerX, hex.centerY-10);
            ctx.font='10px Georgia';ctx.fillText(
                hex.frequency
                //hex.col +'-'+ hex.row +'-'+hex.index
                , hex.centerX, hex.centerY+18);
            ctx.closePath();

        }

		function checkHexes(overRide) {
            if (menuService.controlsIndex === 0) {
                //get hover index
                if (!controlsService.events.mouseDown) {
                    hoverIndex = -1;
                    for (var i = 0; i < hexGrid.hexes.length; i++){
                        if (pointInPolygon(hexGrid.hexes[i].xArray,hexGrid.hexes[i].yArray,controlsService.events.mouseX,controlsService.events.mouseY)) {
                            hoverIndex = i;
                            break;
                        }
                    }
                }
            }
            if (menuService.controlsIndex === 1 && overRide) {
                hoverIndex = -1;
                for (i = 0; i < hexGrid.hexes.length; i++){
                    if (pointInPolygon(hexGrid.hexes[i].xArray,hexGrid.hexes[i].yArray,controlsService.events.mouseX,controlsService.events.mouseY)) {
                        hoverIndex = i;
                        break;
                    }
                }
            }

            //-----------------------------------------------------draw hexes
            if (hoverIndex != lastHoverIndex || overRide) {
                ctx.clearRect(0, 0, w, h);
                for (i = 0; i < hexGrid.hexes.length; i++){
                    if (i != hoverIndex) {
	                    drawHex(hexGrid.hexes[i], false);
                    }
                }
            }
            //draw hover hex last, so that the border stands out
            if ((hoverIndex != -1)) {
                drawHex(hexGrid.hexes[hoverIndex],true);
            }
            //play notes
            hoverIndex === -1 ? audioService.stopHexSound() : audioService.playHexSound(hexGrid.hexes[hoverIndex].frequency);
            lastHoverIndex = hoverIndex;
        };
    }