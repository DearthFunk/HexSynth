angular
	.module('dropDownModule', [])
    .directive('dropDown', dropDown);

	dropDown.$inject = [];

	function dropDown() {
		var directive = {
			restrict: 'EA',
			scope: {
				list: '=list',
				returnIndex: '=returnIndex',
				callBack: '=callBack',
				selected: '=selected'
			},
			templateUrl: 'elements/dropDown/dropDown.html',
			replace: true,
			controller: dropDownController,
			bindToController: true
		};
		return directive
	}

	dropDownController.$inject = ['$scope'];

	function dropDownController($scope) {

		var adjust = 4;
		$scope.expanded = false;
		$scope.offset = 0;
		$scope.maxListLength = 10;

		$scope.toggleExpanded = toggleExpanded;
		$scope.selectValue = selectValue;
		$scope.scroll = scroll;

		//////////////////////////////////////////////////////////////////

		function toggleExpanded() {
			$scope.expanded = !$scope.expanded;
			if ($scope.selected + $scope.maxListLength > $scope.list.length) {
				$scope.offset = $scope.list.length - $scope.maxListLength;
			}
			else {
				$scope.offset = $scope.selected;
			}
		}

		function scroll(directionUP) {
			directionUP ?
				$scope.offset + $scope.maxListLength + adjust < $scope.list.length ?
					$scope.offset += adjust :
					$scope.offset = $scope.list.length - $scope.maxListLength
				:
				$scope.offset - adjust < 0 ?
					$scope.offset = 0 :
					$scope.offset -= adjust;
		}

		function selectValue(index) {
			$scope.expanded = false;
			$scope.selected = index;
			for (var i = 0; i < $scope.list.length; i++) {
				$scope.list[i].DDhovering = false;
			}
			if (angular.isDefined($scope.callBack)) {
				$scope.callBack.toRun($scope.returnIndex, index);
			}
		}
	}