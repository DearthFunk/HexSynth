angular
	.module('htmlModule', [])
	.directive('html', html);

	html.$inject = ['$rootScope','$window','controlsService','audioService','localStorageService', 'menuService'];

	function html($rootScope,$window, controlsService, audioService, localStorageService, menuService){
        return {
            restrict: 'E',
            link: function(scope,element){

	            //window events
                $window.onblur = windowOnBlur;
	            $window.onresize = windowOnResize;
	            $window.onbeforeunload = windowOnBeforeUnload;

				//control events
	            element.bind('mousewheel', mouseWheel);
	            element.bind('mousemove', mouseMove);
	            element.bind('mousedown', mouseDown);
	            element.bind('mouseup', mouseUp);
	            element.bind('keyup', keyUp);
	            element.bind('keydown', keyDown);

	            /////////////////////////////////////////////////////

	            function windowOnBlur(event) {
	                $rootScope.$broadcast('windowBlurEvent',event);
                    audioService.stopHexSound();
                }

	            function windowOnResize() {
                    $rootScope.$broadcast('windowResize');
                }

	            function windowOnBeforeUnload(){
                    var hexSynthDearthFunkSaveObject = localStorageService.getStorageInfo(menuService);
                    localStorage.setItem('hexSynthDearthFunkSaveObject', JSON.stringify(hexSynthDearthFunkSaveObject));
                }

	            function mouseWheel(event){
                    if (event.target.localName != 'textarea') {
                        $rootScope.$broadcast('mouseWheelEvent',event);
                    }
                }

	            function mouseMove(event) {
                    if (event.target.localName != 'textarea') {
	                    controlsService.events.mouseX = event.clientX;
	                    controlsService.events.mouseY = event.clientY;
                        $rootScope.$broadcast('mouseMoveEvent',event);
                    }
                }

	            function mouseDown(event) {
                    if (event.target.localName != 'textarea') {
	                    controlsService.events.mouseDown = true;
                        $rootScope.$broadcast('mouseDownEvent',event);
                    }
                }

	            function mouseUp(event){
                    if (event.target.localName != 'textarea') {
	                    controlsService.events.mouseDown = false;
                        $rootScope.$broadcast('mouseUpEvent',event);
                    }
                }

	            function keyDown(event){
                    if (event.target.localName != 'textarea') {
                        audioService.handleKeyPress(event);
                        var controls = controlsService.controls[menuService.controlsIndex];
                        var synthTemplate = menuService.synthTemplates[menuService.synthIndex];
                        for (var i = 0; i < controls.bypasses.length; i++) {
                            if (event.keyCode === controls.bypasses[i]) {
                                var toSwitch = controls.bypassFunctions[i];
                                synthTemplate.controls[toSwitch].bypass = !synthTemplate.controls[toSwitch].bypass;
                                audioService.updateSynthValues();
                            }
                        }
                    }
                }

	            function keyUp(event) {

	            }

            }
        }
    }