angular.module('audioServiceModule', [])
    .service("audioService", function(eventService){

        var audioCtx = typeof AudioContext !== 'undefined' ?	new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() :	null;
        var audioServiceScope = this;
        var tuna = new Tuna(audioCtx);
        var playing = false;

        var nodeOsc1 = audioCtx.createOscillator();
        var nodeOsc2 = audioCtx.createOscillator();
        var nodeOsc3 = audioCtx.createOscillator();
        var nodeStopper = audioCtx.createGain();
        var nodeMasterGain = audioCtx.createGain();
        var nodeJavascript = audioCtx.createScriptProcessor(audioBufferSize, 0, 1);
        var nodeAnalyser = audioCtx.createAnalyser();
        var fxPhaser = new tuna.Phaser();
        var fxTremolo = new tuna.Tremolo();
        var fxWahwah = new tuna.WahWah();
        var fxDelay = new tuna.Delay();
        var fxOverdrive = new tuna.Overdrive();
        var fxBitCrusher = new tuna.Bitcrusher();


        nodeStopper.connect(fxPhaser.input);
        fxPhaser.connect    (fxTremolo.input);
        fxTremolo.connect   (fxWahwah.input);
        fxWahwah.connect	(fxDelay.input);
        fxDelay.connect     (fxOverdrive.input);
        fxOverdrive.connect (fxBitCrusher.input);
        fxBitCrusher.connect(nodeMasterGain);

        nodeMasterGain.connect(nodeAnalyser);
        nodeMasterGain.connect(audioCtx.destination);

        nodeAnalyser.smoothingTimeConstant = 0.3;
        nodeAnalyser.fftSize = audioBufferSize / 2;
        nodeAnalyser.connect(nodeJavascript);
        nodeJavascript.connect(audioCtx.destination);

        audioServiceScope.analyser = nodeAnalyser;
        audioServiceScope.synthTemplates = angular.isObject(hexSynthLocalStorage) ? hexSynthLocalStorage.synthTemplates : deepCopy(synthTemplates);
        audioServiceScope.synthIndex = angular.isObject(hexSynthLocalStorage) ? hexSynthLocalStorage.synthIndex : 0;
        audioServiceScope.volume = angular.isObject(hexSynthLocalStorage) ? hexSynthLocalStorage.volume : 0.5;

        nodeOsc1.type = audioServiceScope.synthTemplates[audioServiceScope.synthIndex].controls.oscillators.type[0];
        nodeOsc2.type = audioServiceScope.synthTemplates[audioServiceScope.synthIndex].controls.oscillators.type[1];
        nodeOsc3.type = audioServiceScope.synthTemplates[audioServiceScope.synthIndex].controls.oscillators.type[2];
        nodeOsc1.frequency.value = 0;
        nodeOsc2.frequency.value = 0;
        nodeOsc3.frequency.value = 0;

        nodeOsc1.connect(nodeStopper);
        nodeOsc2.connect(nodeStopper);
        nodeOsc3.connect(nodeStopper);
        nodeOsc1.start(0);
        nodeOsc2.start(0);
        nodeOsc3.start(0);


        audioServiceScope.changeVolume = function(x) {
            nodeMasterGain.gain.value = x;
        };

        audioServiceScope.updateSynthValues = function() {

            var data = audioServiceScope.synthTemplates[audioServiceScope.synthIndex].controls;

            nodeOsc1.type = data.oscillators.type[0] == -1 ? "" : oscWaveTypes[data.oscillators.type[0]].type;
            nodeOsc2.type = data.oscillators.type[1] == -1 ? "" : oscWaveTypes[data.oscillators.type[1]].type;
            nodeOsc3.type = data.oscillators.type[2] == -1 ? "" : oscWaveTypes[data.oscillators.type[2]].type;

            nodeOsc1.detune.value = data.oscillators.detune[0];
            nodeOsc2.detune.value = data.oscillators.detune[1];
            nodeOsc3.detune.value = data.oscillators.detune[2];

            fxBitCrusher.bypass     = !data.bitcrusher.bypass;
            fxBitCrusher.bits       = data.bitcrusher.bits;
            fxBitCrusher.bufferSize = data.bitcrusher.bufferSize;
            fxBitCrusher.normFreq   = data.bitcrusher.normFreq;

            fxDelay.bypass     = !data.delay.bypass;
            fxDelay.wetLevel   = data.delay.wetLevel;
            fxDelay.dryLevel   = data.delay.dryLevel;
            fxDelay.feedback   = data.delay.feedback;
            fxDelay.delayTime  = data.delay.delayTime;
            fxDelay.cutoff     = data.delay.cutoff;

            fxOverdrive.bypass            = !data.overdrive.bypass;
            fxOverdrive.curveAmount       = data.overdrive.curveAmount;
            fxOverdrive.drive             = data.overdrive.drive;
            fxOverdrive.outputGain        = data.overdrive.outputGain;

            fxPhaser.bypass                     = !data.phaser.bypass;
            fxPhaser.rate                       = data.phaser.rate;
            fxPhaser.depth                      = data.phaser.depth;
            fxPhaser.feedback                   = data.phaser.feedback;
            fxPhaser.stereoPhase                = data.phaser.stereoPhase;
            fxPhaser.baseModulationFrequency    = data.phaser.baseModulationFrequency;

            fxTremolo.bypass        = !data.tremolo.bypass;
            fxTremolo.intensity     = data.tremolo.intensity;
            fxTremolo.rate          = data.tremolo.rate;
            fxTremolo.stereoPhase   = data.tremolo.stereoPhase;

            fxWahwah.bypass             = !data.wahwah.bypass;
            fxWahwah.baseFrequency      = data.wahwah.baseFrequency;
            fxWahwah.excursionOctaves   = data.wahwah.excursionOctaves;
            fxWahwah.sweep              = data.wahwah.sweep;
            fxWahwah.resonance          = data.wahwah.resonance;

        };

        audioServiceScope.handleKeyPress = function(e) {
            switch (e.keyCode) {
                case eventService.controls[eventService.controlsIndex].bypasses[0] : fxBitCrusher.bypass = !fxBitCrusher.bypass; break;
                case eventService.controls[eventService.controlsIndex].bypasses[1] : fxOverdrive.bypass = !fxOverdrive.bypass;   break;
                case eventService.controls[eventService.controlsIndex].bypasses[2] : fxTremolo.bypass = !fxTremolo.bypass;       break;
                case eventService.controls[eventService.controlsIndex].bypasses[3] : fxWahwah.bypass = !fxWahwah.bypass;         break;
                case eventService.controls[eventService.controlsIndex].bypasses[4] : fxPhaser.bypass = !fxPhaser.bypass;         break;
                case eventService.controls[eventService.controlsIndex].bypasses[5] : fxDelay.bypass = !fxDelay.bypass;           break;
            }
        };

        audioServiceScope.playHexSound = function(freq) {
            var data = audioServiceScope.synthTemplates[audioServiceScope.synthIndex].controls;
            if (!playing) {
                nodeStopper.gain.value = 1;
                playing = true;
            }
            nodeOsc1.frequency.value = data.oscillators.type[0] > 0 ? freq : 0;
            nodeOsc2.frequency.value = data.oscillators.type[1] > 0 ? freq : 0;
            nodeOsc3.frequency.value = data.oscillators.type[2] > 0 ? freq : 0;

        };

        audioServiceScope.stopHexSound = function () {
            if (playing)  {
                nodeStopper.gain.value = 0;
                playing = false;
            }
        };

        audioServiceScope.updateSynthValues();

    });

