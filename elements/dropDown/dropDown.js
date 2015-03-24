angular.module('dropDownElement', [])

    .directive('dropDown', function() {
        return {
            restrict:'C',
            scope: {
                list: "=list",
                returnIndex: "=returnIndex",
                callBack: "=callBack",
                selected: "=selected"
            },
            templateUrl:'elements/dropDown/dropDown.html',
            replace: true,
            link: function(scope) {

                var adjust = 4;
	            scope.expanded = false;
	            scope.offset = 0;
	            scope.maxListLength = 10;

	            scope.toggleExpanded = function(){
	                scope.expanded = !scope.expanded;
					if (scope.selected + scope.maxListLength > scope.list.length) {
						scope.offset = scope.list.length - scope.maxListLength;
					}
		            else {

						scope.offset = scope.selected;
					}
	            };

	            scope.scroll = function(directionUP) {
					directionUP ?
						scope.offset + scope.maxListLength + adjust < scope.list.length ?
							scope.offset += adjust :
							scope.offset = scope.list.length - scope.maxListLength
						:
						scope.offset - adjust < 0 ?
							scope.offset = 0 :
							scope.offset -= adjust;
	            };

                scope.selectValue = function(index) {
                    scope.expanded = false;
                    scope.selected = index;
                    for (var i = 0; i < scope.list.length; i++) {
                        scope.list[i].DDhovering = false;
                    }

                    if (angular.isDefined(scope.callBack)) {
                        scope.callBack.toRun(scope.returnIndex,index);
                    }

                }
            }
        }
    });
