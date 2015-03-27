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
function getStorageInfo(audioService,themeService,eventService,visualizerCanvasService,hexCanvasService) {
    return {
        active: false,
        volume: audioService.volume,
        hexSize: hexCanvasService.hexSize,
        synthIndex: audioService.synthIndex,
        themeIndex: themeService.themeIndex,
        controlsIndex: eventService.controlsIndex,
        visualizerIndex: visualizerCanvasService.visualizerIndex,
        synthTemplates: angular.copy(audioService.synthTemplates)
    };

}
function getHexSize(x) {
    return (10 - Math.floor(x * 14)) + 40;
}
function randomRGBA () {
    return 'rgba(' +
        Math.floor(Math.random()*255+1) + ',' +
        Math.floor(Math.random()*255+1) + ',' +
        Math.floor(Math.random()*255+1) + ',' +
        Math.random() + ')';
}
function randomNumber (from,to,decimals) {
    if (decimals != undefined) {
        return (Math.random()*(Number(to)-Number(from))+Number(from)).toFixed(decimals);
    }
    else {
        return Math.random()*(to-from)+from;
    }
}

function roundedNumber(value, precision) {
	var precision = precision || 0,
		neg = value < 0,
		power = Math.pow(10, precision),
		value = Math.round(value * power),
		integral = String((neg ? Math.ceil : Math.floor)(value / power)),
		fraction = String((neg ? -value : value) % power),
		padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
	return parseFloat(precision ? integral + '.' +  padding + fraction : integral);
}
