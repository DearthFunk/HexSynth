angular
	.module('eventServiceModule', [])
	.directive('html', html)
	.factory("eventService", eventService);

	html.$inject = ['$rootScope','$window','themeService','eventService','audioService','hexCanvasService','visualizerCanvasService','localStorageService'];

	function html($rootScope,$window, themeService, eventService, audioService, hexCanvasService, visualizerCanvasService, localStorageService){
        return {
            restrict: 'E',
            link: function(scope,element){

            //window events
                $window.onblur = function(event) {$rootScope.$broadcast("windowBlurEvent",event);
                    audioService.stopHexSound();
                };
                $window.onresize = function() {
                    hexCanvasService.windowResize();
                    visualizerCanvasService.windowResize();
                };
                $window.onbeforeunload = function(){
                    var hexSynthDearthFunkSaveObject = localStorageService.getStorageInfo(audioService,themeService,eventService,visualizerCanvasService,hexCanvasService);

                   localStorage.setItem('hexSynthDearthFunkSaveObject', JSON.stringify(hexSynthDearthFunkSaveObject));
                };


            //mouse events
                element.bind("mousewheel", function(event){
                    if (event.target.localName != "textarea") {
                        $rootScope.$broadcast("mouseWheelEvent",event);
                    }
                });
                element.bind("mousemove", function(event) {
                    if (event.target.localName != "textarea") {
                        hexCanvasService.checkHexes();
                        eventService.events.mouseX = event.clientX;
                        eventService.events.mouseY = event.clientY;
                        $rootScope.$broadcast("mouseMoveEvent",event);
                    }
                });
                element.bind("mousedown", function(event) {
                    if (event.target.localName != "textarea") {
                        eventService.events.mouseDown = true;
                        $rootScope.$broadcast("mouseDownEvent",event);
                    }
                });
                element.bind("mouseup", function(event){
                    if (event.target.localName != "textarea") {
                        eventService.events.mouseDown = false;
                        hexCanvasService.checkHexes(true);
                        $rootScope.$broadcast("mouseUpEvent",event);
                    }
                });

            //keyboard events
                element.bind("keydown", function(event){
                    if (event.target.localName != "textarea") {
                        audioService.handleKeyPress(event);
                        var controls = eventService.controls[eventService.controlsIndex];
                        var synthTemplate = audioService.synthTemplates[audioService.synthIndex];
                        for (var i = 0; i < controls.bypasses.length; i++) {
                            if (event.keyCode == controls.bypasses[i]) {
                                var toSwitch = controls.bypassFunctions[i];
                                synthTemplate.controls[toSwitch].bypass = !synthTemplate.controls[toSwitch].bypass;
                                audioService.updateSynthValues();
                            }
                        }
                    }
                });
                element.bind("keyup", function(event) {
                });
            }
        }
    }

	eventService.$inject = ['localStorageService'];

	function eventService(localStorageService){
        var service = {
	        controls: [
		        {
			        name: "Follower",
			        bypasses: [65, 83, 68, 90, 88, 67],
			        bypassFunctions: ["bitcrusher", "overdrive", "tremolo", "wahwah", "phaser", "delay"]
		        },
		        {
			        name: "Clicker",
			        bypasses: [65, 83, 68, 90, 88, 67],
			        bypassFunctions: ["bitcrusher", "overdrive", "tremolo", "wahwah", "phaser", "delay"]
		        }
	        ],
	        controlsIndex: angular.isObject(localStorageService.storage) ? localStorageService.storage.controlsIndex : 0,
	        events: {
		        mouseX: 0,
		        mouseY: 0,
		        mouseDown: false,
		        keyFx1: false,
		        keyFx2: false,
		        keySquare: false
	        }
        };
		return service;
	}