angular
	.module('rightClickModule', [])
	.directive('rightClick', ngRightClick);

	ngRightClick.$inject = ['$parse'];

	function ngRightClick($parse) {
		return function(scope, element, attrs) {
			var fn = $parse(attrs.ngRightClick);
			element.bind('contextmenu', function(event) {
				scope.$apply(function() {
					event.preventDefault();
					fn(scope, {$event:event});
				});
			});
		};
	}