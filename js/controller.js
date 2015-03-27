angular
	.module('hexSynth', [
		//services
		    'audioServiceModule',
		    'eventServiceModule',
			'localStorageServiceModule',
			'mathServiceModule',
			'browserServiceModule',
		    'hexCanvasServiceModule',
		    'themeServiceModule',
		    'visualizerServiceModule',
		//element directives
			'sliderVerticalModule',
			'dropDownModule',
			'knobModule',
		//directives
			'helpWindowModule',
			'synthControlsModule',
			'copierModule',
			'menuModule'
	])
	.constant('OSC_WAVE_TYPES',[
		{txt:'None'},
		{txt:'Sine'},
		{txt:'Square'},
		{txt:'SawTooth'},
		{txt:'Triangle'}
	])
	.constant('SYNTH_DEFAULT_TEMPLATES', [
		{controls:{phaser:{rate:1.2,depth:0.3,feedback:0.2,stereoPhase:30,baseModulationFrequency:700,bypass:false},tremolo:{intensity:0.3,rate:3.4,stereoPhase:43.875,bypass:true},wahwah:{automode:true,baseFrequency:0.5,excursionOctaves:2,sweep:0.2,resonance:10,sensitivity:0.5,bypass:false},delay:{feedback:0.487,delayTime:300,wetLevel:0.763,dryLevel:0,cutoff:22050,bypass:true},overdrive:{outputGain:0.95,drive:1,curveAmount:0.45,algorithmIndex:0,bypass:true},bitcrusher:{bits:2.781,bufferSize:1072,normFreq:0.1,bypass:true,normfreq:0.475},oscillators:{type:[3,2,0],detune:[0,0,0]}}},
		{controls:{phaser:{rate:1,depth:0.3,feedback:0.2,stereoPhase:30,baseModulationFrequency:700,bypass:false},tremolo:{intensity:0.3,rate:0.1,stereoPhase:0,bypass:false},wahwah:{automode:true,baseFrequency:0.3,excursionOctaves:3,sweep:0.7,resonance:80,sensitivity:0.5,bypass:true},delay:{feedback:0.5,delayTime:150,wetLevel:0.3,dryLevel:1,cutoff:20,bypass:false},overdrive:{outputGain:0.3,drive:0,curveAmount:1,algorithmIndex:0,bypass:true},bitcrusher:{bits:4,bufferSize:4096,normFreq:0.1,bypass:false},oscillators:{type:[0,1,0],detune:[0,0,0]}}},
		{controls:{phaser:{rate:1.2,depth:0.3,feedback:0.2,stereoPhase:30,baseModulationFrequency:700,bypass:false},tremolo:{intensity:0.3,rate:0.1,stereoPhase:0,bypass:false},wahwah:{automode:true,baseFrequency:0.5,excursionOctaves:2,sweep:0.2,resonance:10,sensitivity:0.5,bypass:false},delay:{feedback:0.475,delayTime:78.75,wetLevel:0.731,dryLevel:0.406,cutoff:1809.938,bypass:true},overdrive:{outputGain:0.5,drive:0,curveAmount:0.819,algorithmIndex:0,bypass:false},bitcrusher:{bits:4,bufferSize:4096,normFreq:0.1,bypass:false},oscillators:{type:[0,1,0],detune:[0,0,0]}}},
		{controls:{phaser:{rate:3.048,depth:0.438,feedback:0.351,stereoPhase:88.5,baseModulationFrequency:856.25,bypass:false},tremolo:{intensity:0.3,rate:0.1,stereoPhase:0,bypass:true},wahwah:{automode:true,baseFrequency:0.5,excursionOctaves:2,sweep:0.2,resonance:10,sensitivity:0.5,bypass:false},delay:{feedback:0.45,delayTime:150,wetLevel:0.25,dryLevel:1,cutoff:20,bypass:false},overdrive:{outputGain:0.5,drive:0.7,curveAmount:1,algorithmIndex:0,bypass:false},bitcrusher:{bits:1.844,bufferSize:1273.6,normFreq:0.1,bypass:true},oscillators:{type:[2,2,0],detune:[-1600,0,0]}}},
		{controls:{phaser:{rate:1.2,depth:0.3,feedback:0.2,stereoPhase:30,baseModulationFrequency:700,bypass:false},tremolo:{intensity:0.3,rate:0.1,stereoPhase:0,bypass:false},wahwah:{automode:true,baseFrequency:0.5,excursionOctaves:2,sweep:0.2,resonance:10,sensitivity:0.5,bypass:false},delay:{feedback:0.281,delayTime:300,wetLevel:0.8,dryLevel:1,cutoff:17919.376,bypass:true},overdrive:{outputGain:0.5,drive:0,curveAmount:0.819,algorithmIndex:0,bypass:true},bitcrusher:{bits:4,bufferSize:4096,normFreq:0.1,bypass:false},oscillators:{type:[0,1,0],detune:[0,0,0]}}},
		{controls:{phaser:{rate:1,depth:0.3,feedback:0.2,stereoPhase:30,baseModulationFrequency:700,bypass:false},tremolo:{intensity:0.3,rate:7.549,stereoPhase:120.375,bypass:true},wahwah:{automode:true,baseFrequency:0.3,excursionOctaves:3,sweep:0.7,resonance:80,sensitivity:0.5,bypass:false},delay:{feedback:0.231,delayTime:150,wetLevel:0.863,dryLevel:0.663,cutoff:16542.5,bypass:true},overdrive:{outputGain:0.038,drive:0,curveAmount:1,algorithmIndex:0,bypass:true},bitcrusher:{bits:2.5,bufferSize:4096,normFreq:0.1,bypass:true},oscillators:{type:[2,1,4],detune:[-775,0,2000]}}}
	])
	.controller('hexController',
        function hexController( $scope , themeService ){
            $scope.copierVisible = false;
            $scope.helpWindowVisible = true;
            $scope.themeService = themeService;
        }
    );