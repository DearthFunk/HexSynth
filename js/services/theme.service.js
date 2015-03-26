angular.module('themeServiceModule', [])

	.service('themeService', function(){

		var themeServiceScope = this;
        themeServiceScope.themes = themes;
        themeServiceScope.themeIndex = angular.isObject(hexSynthLocalStorage) ? hexSynthLocalStorage.themeIndex : 0;

	});


