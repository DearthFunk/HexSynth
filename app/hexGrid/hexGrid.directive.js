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
	        lastHoverIndex = -2;
        var ctx = $element[0].getContext('2d');
		var hexScreenPadding = 30;
        var hexGrid = {};

		$scope.windowResize = windowResize;
		$scope.recalculateAndDrawHexes = recalculateHexes;
		$scope.drawHex = drawHex;
		$scope.checkHoverIndex = checkHoverIndex;

		$scope.$on('hexSizeUpdate', function() {
			recalculateHexes();
			drawEntireHexGrid();
		});
		$scope.$on('themeChange', function(){
			drawEntireHexGrid();
		});
		$scope.$on('mouseMoveEvent', function() {
			checkHoverIndex();
			drawSurroundingHexes();
		});
		$scope.$on('windowResizeEvent', function() {
			windowResize();
			recalculateHexes();
			drawEntireHexGrid();
		});

		windowResize();
		recalculateHexes();
		drawEntireHexGrid();

		////////////////////////////////////////////////
		
        function windowResize() {
            w = $window.innerWidth;
            h = $window.innerHeight;
            ctx.canvas.style.width = w +'px';
            ctx.canvas.style.height = h + 'px';
            angular.element(ctx.canvas).attr({width:  w, height: h	});
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

		function recalculateHexes() {
			var size = (10 - Math.floor(menuService.hexSize * 14)) + 40;
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

            for (var col = 0; col < numCols; col++) {
                for (var row = 0; row < numRows; row++) {
                    xPos = col * hexGrid.hexSide + hexScreenPadding;
                    yPos = (row * hexGrid.hexHeight) + (offsetColumn ? hexGrid.hexHeight * 0.5 : 0) + hexScreenPadding;
                    var noteIndex = ((col%2 === 0 ? 0 : 9) + (Math.floor(col/2)+(row*5))) % notes.length;

	                var xPosWidth = xPos + hexGrid.hexWidth;
	                var xPosSide = xPos + hexGrid.hexSide;
	                var yPosHeight = yPos +hexGrid.hexHeight;

                    hexGrid.hexes.push({
                        col: col,
                        row: row,
                        noteIndex: noteIndex,
                        index:(col*row) + row,
                        frequency: Math.floor(440 * Math.pow(2, (noteIndex + (row * 12) - 48) / 12)),
                        sharp: [1,3,6,8,10].indexOf(noteIndex) !== -1,
                        centerX: xPos - size + hexGrid.hexWidth,
                        centerY: yPos + (hexGrid.hexHeight / 2),
                        xArray:[
	                        xPosWidth - hexGrid.hexSide,
	                        xPosSide,
	                        xPosWidth,
	                        xPosSide,
	                        xPosWidth - hexGrid.hexSide,
                            xPos
                        ],
                        yArray:[
                            yPos,
                            yPos,
                            yPos + (hexGrid.hexHeight / 2),
                            yPosHeight,
                            yPosHeight,
                            yPos + (hexGrid.hexHeight / 2)
                        ]
                    });
                }
                offsetColumn = !offsetColumn;
            }
        }
		function drawEntireHexGrid() {
			var x = 0;
			if (hoverIndex !== lastHoverIndex) {
				//ctx.clearRect(0, 0, w, h);
				for (var i = 0; i < hexGrid.hexes.length; i++){
					if (i !== hoverIndex) {
						drawHex(hexGrid.hexes[i], false);
						x++;
					}
				}
				if ((hoverIndex !== -1)) {
					drawHex(hexGrid.hexes[hoverIndex],true);
					audioService.playHexSound(hexGrid.hexes[hoverIndex].frequency)
				}
				else {
					audioService.stopHexSound()
				}
				lastHoverIndex = hoverIndex;
			}

		}
		function drawSurroundingHexes() {

			if (hoverIndex !== lastHoverIndex) {

				//ctx.clearRect(0, 0, w, h);

				if (hoverIndex !== -1) {
					var hoverHex = hexGrid.hexes[hoverIndex];
					var col = hoverHex.col;
					var row = hoverHex.row;

					for (var i = 0; i < hexGrid.hexes.length; i++) {
						var hex = hexGrid.hexes[i];
						if (hex.col >= col-1 && hex.col <= col+1 &&
							hex.row >= row-1 && hex.row <= row+1) {
							drawHex(hexGrid.hexes[i], false);
						}
					}
				}

				if ((hoverIndex !== -1)) {
					drawHex(hexGrid.hexes[hoverIndex],true);
					audioService.playHexSound(hexGrid.hexes[hoverIndex].frequency)
				}
				else {
					audioService.stopHexSound()
				}
				lastHoverIndex = hoverIndex;
			}

		}
		function eraseHex(hex) {
			ctx.globalCompositeOperation = 'destination-out';
			ctx.beginPath();
			ctx.moveTo(hex.xArray[0],hex.yArray[0]);
			for (var i =1; i < hex.xArray.length; i++){
				ctx.lineTo(hex.xArray[i],hex.yArray[i]);
			}
			ctx.lineTo(hex.xArray[0],hex.yArray[0]);
			ctx.fill();
			ctx.closePath();
			ctx.globalCompositeOperation = 'source-over';
		}
        function drawHex(hex, hover) {
	        eraseHex(hex);
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
            ctx.font='10px Georgia';
	        //ctx.fillText(hex.frequency, hex.centerX, hex.centerY+18);
			ctx.fillText(Math.floor(hex.centerX) + ':' + Math.floor(hex.centerY), hex.centerX, hex.centerY+18);
	        //ctx.fillText(hex.col + ':' + hex.row, hex.centerX, hex.centerY + 18);
            ctx.closePath();
        }

		function checkHoverIndex() {
			if (hexGrid.hexes) {
				if (menuService.controlsIndex === 0 && !controlsService.events.mouseDown) {
					hoverIndex = -1;
					var x = controlsService.events.mouseX;
					var y = controlsService.events.mouseY;
					var halfW = hexGrid.hexWidth / 2;
					var halfH = hexGrid.hexHeight / 2;

					for (var i = 0; i < hexGrid.hexes.length; i++){
						if (x >= hexGrid.hexes[i].centerX - halfW &&
							x <= hexGrid.hexes[i].centerX + halfW &&
							y >= hexGrid.hexes[i].centerY - halfH &&
							y <= hexGrid.hexes[i].centerY + halfH) {
							if (pointInPolygon(hexGrid.hexes[i].xArray,hexGrid.hexes[i].yArray,x,y)) {
								hoverIndex = i;
								break;
							}
						}
					}
				}

				if (menuService.controlsIndex === 1) {
					hoverIndex = -1;
					for (i = 0; i < hexGrid.hexes.length; i++){
						if (pointInPolygon(hexGrid.hexes[i].xArray,hexGrid.hexes[i].yArray,controlsService.events.mouseX,controlsService.events.mouseY)) {
							hoverIndex = i;
							break;
						}
					}
				}
			}
        }
    }