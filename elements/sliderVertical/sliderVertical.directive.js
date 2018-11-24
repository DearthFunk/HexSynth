angular
	.module('sliderVerticalModule', [])
    .directive('sliderVertical', sliderVertical);

	sliderVertical.$inject = [];

	function sliderVertical() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'elements/sliderVertical/sliderVertical.directive.html',
			replace: true,
			scope: {
				sliderValue: '=sliderValue',
				callBack: '=callBack'
			},
			controller: sliderController,
			bindToController: true
		};
		return directive;
	}

	sliderController.$inject = ['$scope', '$element', 'mathService'];

	function sliderController($scope,$element,mathService) {
		var sliding, startY, originalY, newValue;
		var lastValue = $scope.sliderValue;
		var startingValue = $scope.sliderValue;

		$scope.elemSize = $element[0].getBoundingClientRect();
		$scope.getSliderValue = getSliderValue;
		$scope.resetToOriginal = resetToOriginal;
		$scope.startMovingSlider = startMovingSlider;
		$scope.movePos = movePos;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;

		$scope.$on('mouseUpEvent', $scope.mouseUpEvent);
		$scope.$on('mouseMoveEvent', $scope.mouseMoveEvent);

		///////////////////////////////////////////////////////////////////

		function getSliderValue() {
			return $scope.sliderValue > 1 ? 1 : $scope.sliderValue < 0 ? 0 : $scope.sliderValue;
		}

		function resetToOriginal() {
			$scope.sliderValue = startingValue;
			$scope.callBack(1);
		}

		function startMovingSlider(e) {
			sliding = true;
			startY = e.clientY;
			newValue = parseInt($scope.sliderValue * $scope.elemSize.height);
			originalY = newValue;
		}

		function movePos(e) {
			if (sliding) {return false;}
			$scope.sliderValue = (e.clientY - $scope.elemSize.top) / $scope.elemSize.height;
			$scope.callBack(1 - (mathService.roundedNumber($scope.sliderValue, 1)));
			$scope.startMovingSlider(e);
		}

		function mouseUpEvent() {
			sliding = false;
		}

		function mouseMoveEvent(e, args) {
			if (!sliding) {return false;}
			var newHeight = originalY - startY + args.clientY;

			if (newHeight < 0) {
				newHeight = 0;
				$scope.sliderValue = 0;
			}
			if (newHeight > $scope.elemSize.height) {
				newHeight = $scope.elemSize.height;
				$scope.sliderValue = 1;
			}
			newValue = newHeight;

			//prevents calling action when the value does not change
			if (lastValue != newValue) {
				$scope.sliderValue = newValue / $scope.elemSize.height;
				$scope.callBack(1 - (mathService.roundedNumber($scope.sliderValue, 1)));
				lastValue = newValue;
			}
		}
	}