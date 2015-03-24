var hexSynthLocalStorage = JSON.parse(localStorage.getItem('hexSynthDearthFunkSaveObject'));


if (hexSynthLocalStorage != null) {
    if ('active' in hexSynthLocalStorage) {
        if (hexSynthLocalStorage.active){ hexSynthLocalStorage = false}
    }
    else {
        hexSynthLocalStorage = false;
    }
}
else {
    hexSynthLocalStorage = false;
}

var oscWaveTypes = [
    {txt:'None',     type:""},
    {txt:'Sine',        type:"sine"},
    {txt:'Square',      type:"square"},
    {txt:'SawTooth',    type:"sawtooth"},
    {txt:'Triangle',    type:"triangle"}
];



var hexScreenPadding = 30;
var drawSpeed = 20;
var audioBufferSize = 1024;
var controlsIndex = angular.isObject(hexSynthLocalStorage) ? hexSynthLocalStorage.controlsIndex : 0;
var notes = ["A","A '","B","C","C '","D","D '","E","F","F '","G","G '"];

var defaultEventValues = {
    mouseX: 0,
    mouseY: 0,
    mouseDown: false,
    keyFx1: false,
    keyFx2: false,
    keySquare: false
};

var visualizers = [
    {name:"None",   globalCompositeOperation: "",            clearCanvas:false, functionToRun: false},
    {name:"Bubbles",globalCompositeOperation: "lighter",     clearCanvas:true,  functionToRun: "visBubbles"},
    {name:"Scope",  globalCompositeOperation: "source-over", clearCanvas:false, functionToRun: "visScope"},
    {name:"Tracer",   globalCompositeOperation: "lighter",   clearCanvas:true,  functionToRun: "visTracer"}


];

var controls = [
    {   name:"Follower",
        bypasses:[65,83,68,90,88,67],
        bypassFunctions: ["bitcrusher","overdrive","tremolo","wahwah","phaser","delay"]
    },
    {   name: "Clicker",
        bypasses:[65,83,68,90,88,67],
        bypassFunctions: ["bitcrusher","overdrive","tremolo","wahwah","phaser","delay"]
    }
];

/*-------------------------------------------------------------------------------------------------BROWSER ID---------*/
var browserType = navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M;//.join(' ');
})();
var isChrome = browserType[0] == "Chrome";
var isFirefox = browserType[0] == "Firefox";
var isSafari = browserType[0] == "Safari";


/*-------------------------------------------------------------------------------------------------SYNTH TEMPLATES----*/
var synthTemplates = [
    {controls:{"phaser":{"rate":1.2,"depth":0.3,"feedback":0.2,"stereoPhase":30,"baseModulationFrequency":700,"bypass":false},"tremolo":{"intensity":0.3,"rate":3.4,"stereoPhase":43.875,"bypass":true},"wahwah":{"automode":true,"baseFrequency":0.5,"excursionOctaves":2,"sweep":0.2,"resonance":10,"sensitivity":0.5,"bypass":false},"delay":{"feedback":0.487,"delayTime":300,"wetLevel":0.763,"dryLevel":0,"cutoff":22050,"bypass":true},"overdrive":{"outputGain":0.95,"drive":1,"curveAmount":0.45,"algorithmIndex":0,"bypass":true},"bitcrusher":{"bits":2.781,"bufferSize":1072,"normFreq":0.1,"bypass":true,"normfreq":0.475},"oscillators":{"type":[3,2,0],"detune":[0,0,0]}}},
    {controls:{"phaser":{"rate":1,"depth":0.3,"feedback":0.2,"stereoPhase":30,"baseModulationFrequency":700,"bypass":false},"tremolo":{"intensity":0.3,"rate":0.1,"stereoPhase":0,"bypass":false},"wahwah":{"automode":true,"baseFrequency":0.3,"excursionOctaves":3,"sweep":0.7,"resonance":80,"sensitivity":0.5,"bypass":true},"delay":{"feedback":0.5,"delayTime":150,"wetLevel":0.3,"dryLevel":1,"cutoff":20,"bypass":false},"overdrive":{"outputGain":0.3,"drive":0,"curveAmount":1,"algorithmIndex":0,"bypass":true},"bitcrusher":{"bits":4,"bufferSize":4096,"normFreq":0.1,"bypass":false},"oscillators":{"type":[0,1,0],"detune":[0,0,0]}}},
    {controls:{"phaser":{"rate":1.2,"depth":0.3,"feedback":0.2,"stereoPhase":30,"baseModulationFrequency":700,"bypass":false},"tremolo":{"intensity":0.3,"rate":0.1,"stereoPhase":0,"bypass":false},"wahwah":{"automode":true,"baseFrequency":0.5,"excursionOctaves":2,"sweep":0.2,"resonance":10,"sensitivity":0.5,"bypass":false},"delay":{"feedback":0.475,"delayTime":78.75,"wetLevel":0.731,"dryLevel":0.406,"cutoff":1809.938,"bypass":true},"overdrive":{"outputGain":0.5,"drive":0,"curveAmount":0.819,"algorithmIndex":0,"bypass":false},"bitcrusher":{"bits":4,"bufferSize":4096,"normFreq":0.1,"bypass":false},"oscillators":{"type":[0,1,0],"detune":[0,0,0]}}},
    {controls:{"phaser":{"rate":3.048,"depth":0.438,"feedback":0.351,"stereoPhase":88.5,"baseModulationFrequency":856.25,"bypass":false},"tremolo":{"intensity":0.3,"rate":0.1,"stereoPhase":0,"bypass":true},"wahwah":{"automode":true,"baseFrequency":0.5,"excursionOctaves":2,"sweep":0.2,"resonance":10,"sensitivity":0.5,"bypass":false},"delay":{"feedback":0.45,"delayTime":150,"wetLevel":0.25,"dryLevel":1,"cutoff":20,"bypass":false},"overdrive":{"outputGain":0.5,"drive":0.7,"curveAmount":1,"algorithmIndex":0,"bypass":false},"bitcrusher":{"bits":1.844,"bufferSize":1273.6,"normFreq":0.1,"bypass":true},"oscillators":{"type":[2,2,0],"detune":[-1600,0,0]}}},
    {controls:{"phaser":{"rate":1.2,"depth":0.3,"feedback":0.2,"stereoPhase":30,"baseModulationFrequency":700,"bypass":false},"tremolo":{"intensity":0.3,"rate":0.1,"stereoPhase":0,"bypass":false},"wahwah":{"automode":true,"baseFrequency":0.5,"excursionOctaves":2,"sweep":0.2,"resonance":10,"sensitivity":0.5,"bypass":false},"delay":{"feedback":0.281,"delayTime":300,"wetLevel":0.8,"dryLevel":1,"cutoff":17919.376,"bypass":true},"overdrive":{"outputGain":0.5,"drive":0,"curveAmount":0.819,"algorithmIndex":0,"bypass":true},"bitcrusher":{"bits":4,"bufferSize":4096,"normFreq":0.1,"bypass":false},"oscillators":{"type":[0,1,0],"detune":[0,0,0]}}},
    {controls:{"phaser":{"rate":1,"depth":0.3,"feedback":0.2,"stereoPhase":30,"baseModulationFrequency":700,"bypass":false},"tremolo":{"intensity":0.3,"rate":7.549,"stereoPhase":120.375,"bypass":true},"wahwah":{"automode":true,"baseFrequency":0.3,"excursionOctaves":3,"sweep":0.7,"resonance":80,"sensitivity":0.5,"bypass":false},"delay":{"feedback":0.231,"delayTime":150,"wetLevel":0.863,"dryLevel":0.663,"cutoff":16542.5,"bypass":true},"overdrive":{"outputGain":0.038,"drive":0,"curveAmount":1,"algorithmIndex":0,"bypass":true},"bitcrusher":{"bits":2.5,"bufferSize":4096,"normFreq":0.1,"bypass":true},"oscillators":{"type":[2,1,4],"detune":[-775,0,2000]}}}
];

/*-------------------------------------------------------------------------------------------------THEMES-------------*/
var themes = [
	{
		name: "Blue Blocks",
		main:{
			backgroundImage: "url('img/background1.jpg')"
		},
		hex: {
			fill: "rgba(68,68,221,0.5)",
            fillSharp: "rgba(221,221,68,0.5)",
			border: "#FFFFFF",
			text: "#FFFFFF",
            innerDot: "#FFFFFF"
		},
		hexActive: {
			fill: "#000000",
            fillSharp: "#000000",
			border:"#FF0000",
			text: "#FFFFFF",
            innerDot: "#FF0000"
		}
	},
	{
		name: "Science Bitch!",
		main:{
			backgroundImage: "url('img/background2.jpg')"
		},
        hex: {
            fill: "rgba(70,255,70,0.7)",
            fillSharp: "rgba(221,255,68,0.5)",
            border: "#FFFFFF",
            text: "#FFFFFF",
            innerDot: "#FFFFFF"
        },
        hexActive: {
            fill: "#00FF00",
            fillSharp: "#00FF00",
            border:"#0000FF",
            text: "#000000",
            innerDot: "#000000"
        }
	},
	{
		name: "Color PeepShow",
		main:{
			backgroundImage: "url('img/background3.jpg')"
		},
        hex: {
            fill: "rgba(255,255,255,0.8)",
            fillSharp: "rgba(255,255,255,0.4)",
            border: "#72BCD4",
            text: "#000000",
            innerDot: "#000000"
        },
        hexActive: {
            fill: "rgba(255,105,180,0.4)",
            fillSharp: "rgba(255,105,180,0.4)",
            border:"#000000",
            text: "#0000FF",
            innerDot: "#0000FF"
        }
	},	{
        name: "Splatter!",
        main:{
            backgroundImage: "url('img/background4.jpg')"
        },
        hex: {
            fill: "rgba(255,10,0,0.6)",
            fillSharp: "rgba(0,10,255,0.6)",
            border: "#FFFFFF",
            text: "#FFFFFF",
            innerDot: "#FFFFFF"
        },
        hexActive: {
            fill: "rgba(0,255,0,0.6)",
            fillSharp: "rgba(0,255,0,0.6)",
            border: "#000000",
            text: "#000000",
            innerDot: "#000000"
        }
    }

];

