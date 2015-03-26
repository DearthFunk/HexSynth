angular
	.module('helpWindowModule', [])
    .directive('helpWindow', helpWindow);

	helpWindow.$inject = [];

	function helpWindow() {
		return {
			restrict: 'EA',
			templateUrl: 'directives/helpWindow/helpWindow.html',
			replace: true,
			link: helpWindowLink
		}
	}

	helpWindowLink.$inject = ['scope'];

	function helpWindowLink(scope)	{

        scope.preventProp = preventProp;

		////////////////////////////////////////////

		function preventProp(e) {
            e.stopPropagation();
        }
    }