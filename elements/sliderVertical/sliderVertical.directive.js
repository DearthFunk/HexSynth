angular.module('sliderVerticalElement', [])

    .directive('sliderVertical', function(audioService) {
        return {
            restrict:'C',
            templateUrl:'elements/sliderVertical/sliderVertical.html',
            replace: true,
            scope: {
                sliderValue: '=sliderValue',
                callBack: '=callBack'
            },
            link: function(scope,element) {

	            scope.height = element[0].getBoundingClientRect().height;
	            var sliding, startY, originalY, newValue;
	            var lastValue = scope.sliderValue;
	            var startingValue = scope.sliderValue;
	            var xMin = 0;

                scope.getSliderValue = function(){
                    if(scope.sliderValue > 1){ scope.sliderValue = 1; }
                    if(scope.sliderValue < 0){ scope.sliderValue = 0; }
                    return scope.sliderValue;
                };

				scope.resetToOriginal = function() {
					scope.sliderValue = startingValue;
                    scope.callBack.toRun(1);
				};

                scope.startMovingSlider = function(event) {
                    sliding = true;
                    startY = event.clientY;
                    newValue = parseInt(scope.sliderValue * scope.height);
                    originalY = newValue;
                };

	            scope.movePos = function(e) {
		            if (!sliding) {
			            scope.sliderValue = (e.clientY - element[0].getBoundingClientRect().top) / scope.height;
                        scope.callBack.toRun(1 - (roundedNumber(scope.sliderValue,1)));
			            scope.startMovingSlider(e);
		            }
	            };

	            scope.$on('mouseUpEvent', function() {
                    sliding = false;
                });

                scope.$on('mouseMoveEvent', function(event, args) {
                    if(sliding){
                        var newLeft = originalY - startY + args.clientY;

                        if(newLeft < xMin){ newLeft = xMin; scope.sliderValue = 0;}
                        if(newLeft > scope.height){ newLeft = scope.height; scope.sliderValue = 1;}
                        newValue = newLeft;

                        //prevents calling action when the value does not change
                        if(lastValue != newValue){
                            scope.sliderValue = ((newValue - xMin) / (scope.height - xMin));
                            scope.callBack.toRun(1 - (roundedNumber(scope.sliderValue,1)));
                            lastValue = newValue;
                        }
                    }
                });

            }
        }
    });
