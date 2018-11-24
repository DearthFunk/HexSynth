angular
	.module('helpWindowModule', [])
    .directive('helpWindow', helpWindowDirective);

	helpWindowDirective.$inject = [];

	function helpWindowDirective() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'directives/helpWindow/helpWindow.directive.html',
			replace: true,
			transclude: true,
			controller: helpWindowController,
			bindToController: true
		};
		return directive;
	}

	helpWindowController.$inject = ['$scope'];

	function helpWindowController($scope)	{

		$scope.preventProp = preventProp;

		////////////////////////////////////////////

		function preventProp(e) {
            e.stopPropagation();
        }
    }