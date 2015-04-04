angular
	.module('htmlModule', [])
	.directive('html', html);

	html.$inject = ['$rootScope','$window','THEMES','controlsService','audioService','localStorageService', 'menuService'];

	function html($rootScope,$window, THEMES, controlsService, audioService, localStorageService, menuService){
        return {
            restrict: 'E',
            link: function(scope,element){

            //window events
                $window.onblur = function(event) {$rootScope.$broadcast("windowBlurEvent",event);
                    audioService.stopHexSound();
                };
                $window.onresize = function() {
                    //hexCanvasService.windowResize();
                    $rootScope.$broadcast('windowResize');
                };
                $window.onbeforeunload = function(){
                    var hexSynthDearthFunkSaveObject = localStorageService.getStorageInfo(audioService,THEMES,controlsService,menuService);
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
                        //hexCanvasService.checkHexes();
	                    controlsService.events.mouseX = event.clientX;
	                    controlsService.events.mouseY = event.clientY;
                        $rootScope.$broadcast("mouseMoveEvent",event);
                    }
                });
                element.bind("mousedown", function(event) {
                    if (event.target.localName != "textarea") {
	                    controlsService.events.mouseDown = true;
                        $rootScope.$broadcast("mouseDownEvent",event);
                    }
                });
                element.bind("mouseup", function(event){
                    if (event.target.localName != "textarea") {
	                    controlsService.events.mouseDown = false;
                        //hexCanvasService.checkHexes(true);
                        $rootScope.$broadcast("mouseUpEvent",event);
                    }
                });

            //keyboard events
                element.bind("keydown", function(event){
                    if (event.target.localName != "textarea") {
                        audioService.handleKeyPress(event);
                        var controls = controlsService.controls[menuService.controlsIndex];
                        var synthTemplate = audioService.synthTemplates[menuService.synthIndex];
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